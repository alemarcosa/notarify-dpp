import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Response } from 'express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join, resolve } from 'path';
import * as fs from 'fs';
import * as QRCode from 'qrcode';

const storage = diskStorage({
  destination: (req, file, cb) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const uploadRoot = process.env.UPLOAD_DIR || './uploads';
    const targetDir = join(uploadRoot, `${year}`, `${month}`);
    fs.mkdirSync(targetDir, { recursive: true });
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload a file (images or pdfs up to 10MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'application/pdf',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              `Invalid file type "${file.mimetype}". Only JPEG, PNG, WEBP and PDF are accepted.`,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required in upload payload');
    }
    return this.filesService.saveFileRecord(file);
  }

  @Get('qrcode/:uuid')
  @ApiOperation({ summary: 'Get or generate QR code PNG image for a passport UUID' })
  @ApiParam({ name: 'uuid', description: 'Product Passport UUID' })
  async getQrCode(@Param('uuid') uuid: string, @Res() res: Response) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const publicUrl = `${frontendUrl}/passport/${uuid}`;
    const uploadRoot = process.env.UPLOAD_DIR || './uploads';
    const qrPath = join(uploadRoot, 'qrcodes', `${uuid}.png`);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `inline; filename="qr-${uuid.slice(0, 8)}.png"`);

    if (fs.existsSync(qrPath)) {
      return res.sendFile(resolve(qrPath));
    }

    // Fallback: generate and stream directly
    const qrBuffer = await QRCode.toBuffer(publicUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#1a365d',
        light: '#ffffff',
      },
    });

    return res.send(qrBuffer);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve file binary by FileUpload ID' })
  @ApiParam({ name: 'id', description: 'File UUID' })
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const fileRecord = await this.filesService.getFileRecord(id);
    res.setHeader('Content-Type', fileRecord.mimeType);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(fileRecord.originalName)}"`,
    );

    if (fs.existsSync(fileRecord.storagePath)) {
      return res.sendFile(resolve(fileRecord.storagePath));
    }

    return res.status(404).json({
      statusCode: 404,
      message: 'File physical storage not found on server disk',
    });
  }
}
