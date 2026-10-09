import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();

    // Soft delete middleware
    this.$use(async (params, next) => {
      // Check if model has soft delete
      const modelsWithSoftDelete = ['User', 'Product'];

      if (modelsWithSoftDelete.includes(params.model || '')) {
        if (params.action === 'findUnique' || params.action === 'findFirst') {
          // Change to findFirst - you cannot filter on unique constraint with deletedAt
          params.action = 'findFirst';
          
          if (!params.args.where.deletedAt) {
            params.args.where['deletedAt'] = null;
          }
        }
        
        if (params.action === 'findMany') {
          if (!params.args) {
            params.args = { where: {} };
          }
          if (params.args.where === undefined) {
            params.args.where = {};
          }
          if (params.args.where.deletedAt === undefined) {
            params.args.where['deletedAt'] = null;
          }
        }

        if (params.action === 'update' || params.action === 'updateMany') {
          if (!params.args.where) {
            params.args.where = {};
          }
          if (params.args.where.deletedAt === undefined) {
            params.args.where['deletedAt'] = null;
          }
        }

        if (params.action === 'delete') {
          params.action = 'update';
          params.args['data'] = { deletedAt: new Date() };
        }
        
        if (params.action === 'deleteMany') {
          params.action = 'updateMany';
          if (params.args.data === undefined) {
            params.args.data = {};
          }
          params.args.data['deletedAt'] = new Date();
        }
      }
      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
