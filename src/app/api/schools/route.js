import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

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
  const form = formidable({
    maxFileSize: 5 * 1024 * 1024, // 5MB limit
  });

  try {
    console.log('Parsing form data...');
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(nodeRequestFromWeb(request), (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    console.log('Parsed fields:', fields);
    console.log('Parsed files:', files);

    const { name, address, city, state, contact, email_id } = fields;
    const image = files.image?.[0];

    if (!image) {
      console.error('No image provided');
      return new Response(JSON.stringify({ error: 'Image is required' }), { status: 400 });
    }

    console.log('Uploading image to Cloudinary...');
    const uploadResult = await cloudinary.uploader.upload(image.filepath, {
      folder: 'schools',
      public_id: `${Date.now()}-${image.originalFilename.replace(/\.[^/.]+$/, '')}`,
    }).catch((error) => {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    });

    console.log('Cloudinary upload result:', uploadResult);

    try {
      console.log('Saving school to database...');
      await prisma.school.create({
        data: {
          name: name[0],
          address: address[0],
          city: city[0],
          state: state[0],
          contact: BigInt(contact[0]),
          email_id: email_id[0],
          image: uploadResult.secure_url,
        },
      });
      console.log('School saved to database successfully');
    } catch (error) {
      console.error('Database error:', error);
      // Attempt to delete uploaded image if database fails
      await cloudinary.uploader.destroy(uploadResult.public_id).catch((err) => {
        console.error('Failed to clean up Cloudinary image:', err);
      });
      return new Response(JSON.stringify({ error: 'Failed to save school to database', details: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'School added successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/schools:', error);
    return new Response(JSON.stringify({ error: 'Failed to add school', details: error.message }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  try {
    if (id && !isNaN(parseInt(id))) {
      const school = await prisma.school.findUnique({
        where: { id: parseInt(id) },
      });
      if (!school) {
        return new Response(JSON.stringify({ error: 'School not found' }), { status: 404 });
      }
      return new Response(JSON.stringify([{ ...school, contact: school.contact.toString() }]), { status: 200 });
    } else {
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
      const serializedSchools = schools.map((school) => ({
        ...school,
        contact: school.contact.toString(),
      }));
      return new Response(JSON.stringify(serializedSchools), { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching schools:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch schools' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request) {
  const url = new URL(request.url);
  const id = parseInt(url.searchParams.get('id'));

  const form = formidable({
    maxFileSize: 5 * 1024 * 1024,
  });

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(nodeRequestFromWeb(request), (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const data = {};
    if (fields.name) data.name = fields.name[0];
    if (fields.address) data.address = fields.address[0];
    if (fields.city) data.city = fields.city[0];
    if (fields.state) data.state = fields.state[0];
    if (fields.contact) data.contact = BigInt(fields.contact[0]);
    if (fields.email_id) data.email_id = fields.email_id[0];

    const image = files.image?.[0];
    if (image) {
      const oldSchool = await prisma.school.findUnique({ where: { id } });
      if (oldSchool && oldSchool.image) {
        const publicId = oldSchool.image.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(() => { });
      }
      const uploadResult = await cloudinary.uploader.upload(image.filepath, {
        folder: 'schools',
        public_id: `${Date.now()}-${image.originalFilename.replace(/\.[^/.]+$/, '')}`, // strip extension
      });
      data.image = uploadResult.secure_url;
    }

    await prisma.school.update({
      where: { id },
      data,
    });

    return new Response(JSON.stringify({ message: 'School updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating school:', error);
    return new Response(JSON.stringify({ error: 'Failed to update school' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request) {
  const url = new URL(request.url);
  const id = parseInt(url.searchParams.get('id'));
  const imagePath = url.searchParams.get('imagePath');

  try {
    if (imagePath) {
      const publicId = imagePath.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId).catch((error) => {
        console.error('Failed to delete image from Cloudinary:', error);
      });
    }
    await prisma.school.delete({
      where: { id },
    });
    return new Response(JSON.stringify({ message: 'School deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting school:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete school' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}