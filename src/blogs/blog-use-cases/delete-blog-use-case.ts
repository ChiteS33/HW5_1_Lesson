import { Inject } from '@nestjs/common';
import { BlogsService } from '../blogs.service';
import { BlogsRepository } from '../repositories/blogs.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteBlogCommand {
  constructor(public blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(
    @Inject(BlogsService) private blogsService: BlogsService,
    @Inject(BlogsRepository) private blogsRepository: BlogsRepository,
  ) {}
  async execute(command: DeleteBlogCommand): Promise<void> {
    await this.blogsService.findBlogById(command.blogId);
    await this.blogsRepository.deleteBlogById(command.blogId);
    return;
  }
}
