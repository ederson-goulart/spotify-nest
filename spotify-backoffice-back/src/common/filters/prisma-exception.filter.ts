import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const correlationId = request.headers['x-correlation-id'];

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor no processamento do banco de dados.';
    let errorType = 'DatabaseError';

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        const target = (exception.meta?.target as string[])?.join(', ') || 'campo único';
        message = `Já existe um registro com este valor para o campo: ${target}.`;
        errorType = 'ConflictException';
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = (exception.meta?.cause as string) || 'O registro solicitado não foi encontrado no banco de dados.';
        errorType = 'NotFoundException';
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'Falha de chave estrangeira: um registro relacionado obrigatório está ausente ou é inválido.';
        errorType = 'BadRequestException';
        break;
      default:
        message = `Erro de banco de dados (${exception.code}): ${exception.message}`;
        break;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      error: errorType,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  }
}
