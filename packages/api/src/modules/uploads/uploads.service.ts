import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Upload } from './upload.entity';
import * as fs from 'fs';
import * as path from 'path';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly uploadPath: string;

  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepo: Repository<Upload>,
    private readonly configService: ConfigService,
  ) {
    this.uploadPath = this.configService.get<string>('UPLOAD_LOCAL_PATH') || './uploads';
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File, userId: string): Promise<Upload> {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    const upload = this.uploadRepo.create({
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/${file.filename}`,
      driver: 'local',
      uploadedBy: userId,
    });

    const saved = await this.uploadRepo.save(upload);
    this.logger.log(`File uploaded: ${file.originalname} by user ${userId}`);
    return saved;
  }

  async findById(id: string): Promise<Upload> {
    const upload = await this.uploadRepo.findOne({ where: { id } });
    if (!upload) throw new NotFoundException('File not found');
    return upload;
  }

  async findByUser(userId: string): Promise<Upload[]> {
    return this.uploadRepo.find({
      where: { uploadedBy: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const upload = await this.uploadRepo.findOne({ where: { id } });
    if (!upload) throw new NotFoundException('File not found');

    // Delete physical file
    if (upload.driver === 'local' && fs.existsSync(upload.path)) {
      fs.unlinkSync(upload.path);
    }

    await this.uploadRepo.remove(upload);
    this.logger.log(`File deleted: ${upload.originalName}`);
    return { message: 'File deleted successfully' };
  }
}
