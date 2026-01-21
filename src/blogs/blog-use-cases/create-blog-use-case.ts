import { Inject } from '@nestjs/common';
import { BlogInputDto, BlogModel, BlogModelI } from '../blogs.entity';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsRepository } from '../repositories/blogs.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateBlogCommand {
  constructor(public blogInputDto: BlogInputDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    @InjectModel(BlogModel.name) private blogModel: BlogModelI,
    @Inject(BlogsRepository) private blogsRepository: BlogsRepository,
  ) {}
  async execute(command: CreateBlogCommand): Promise<string> {
    const createdBlog = this.blogModel.createBlog(command.blogInputDto);
    return await this.blogsRepository.save(createdBlog);
  }
}
