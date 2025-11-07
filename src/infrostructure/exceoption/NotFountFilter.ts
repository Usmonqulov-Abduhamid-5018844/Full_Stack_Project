import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';


@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();



    const errorResponse = exception.getResponse();
    const message =
      typeof errorResponse === 'string'
        ? errorResponse
        : (errorResponse as any).message || exception.message;

    response.status(404).json({
      statusCode: 404,
      message,
    });
  }
}
