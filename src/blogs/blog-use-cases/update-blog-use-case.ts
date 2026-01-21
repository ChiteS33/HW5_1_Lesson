import { Inject } from '@nestjs/common';
import { BlogInputDto } from '../blogs.entity';
import { BlogsService } from '../blogs.service';
import { BlogsRepository } from '../repositories/blogs.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class UpdateBlogCommand {
  constructor(
    public blogId: string,
    public blogInputDto: BlogInputDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    @Inject(BlogsService) private blogsService: BlogsService,
    @Inject(BlogsRepository) private blogsRepository: BlogsRepository,
  ) {}
  async execute(command: UpdateBlogCommand): Promise<void> {
    const foundBlog = await this.blogsService.findBlogById(command.blogId);
    foundBlog.updateBlog(command.blogInputDto);
    await this.blogsRepository.save(foundBlog);
    return;
  }
}
