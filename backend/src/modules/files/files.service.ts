import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async saveFileRecord(file: Express.Multer.File) {
    return this.prisma.fileUpload.create({
      data: {
        originalName: file.originalname,
        storagePath: file.path,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      },
    });
  }

  async getFileRecord(id: string) {
    const file = await this.prisma.fileUpload.findUnique({
      where: { id },
    });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }
}
