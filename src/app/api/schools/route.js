import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

// Converts Web Request to Node-readable stream for formidable
function nodeRequestFromWeb(request) {
  const reader = request.body.getReader();
  const stream = new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) this.push(null);
      else this.push(value);
    },
  });
  stream.headers = Object.fromEntries(request.headers.entries());
  return stream;
}

export async function POST(request) {
  const uploadDir = path.join(process.cwd(), 'public/schoolImages');

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    console.log('Upload directory ensured:', uploadDir);
  } catch (error) {
    console.error('Failed to create upload directory:', error);
    return new Response(JSON.stringify({ error: 'Failed to create upload directory' }), { status: 500 });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
  });

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(nodeRequestFromWeb(request), (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    console.log('Fields:', fields);
    console.log('Files:', files);

    const { name, address, city, state, contact, email_id } = fields;
    const image = files.image?.[0];

    if (!image) {
      return new Response(JSON.stringify({ error: 'Image is required' }), { status: 400 });
    }

    const timestamp = Date.now();
    const imageName = `${timestamp}-${image.originalFilename}`;
    const imagePath = `/schoolImages/${imageName}`;
    const destinationPath = path.join(uploadDir, imageName);

    try {
      await fs.rename(image.filepath, destinationPath);
      console.log('File moved to:', destinationPath);
    } catch (error) {
      console.error('File move error:', error);
      return new Response(JSON.stringify({ error: 'Failed to save image' }), { status: 500 });
    }

    try {
      await prisma.school.create({
        data: {
          name: name[0],
          address: address[0],
          city: city[0],
          state: state[0],
          contact: BigInt(contact[0]),
          email_id: email_id[0],
          image: imagePath,
        },
      });
      console.log('School saved to database');
    } catch (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Failed to save school to database' }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'School added successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error in API route:', error);
    return new Response(JSON.stringify({ error: 'Failed to add school', details: error.message }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        contact: true,
        email_id: true,
        image: true,
      },
    });
    // Convert BigInt contact to string for JSON serialization
    const serializedSchools = schools.map((school) => ({
      ...school,
      contact: school.contact.toString(),
    }));
    return new Response(JSON.stringify(serializedSchools), { status: 200 });
  } catch (error) {
    console.error('Error fetching schools:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch schools' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}