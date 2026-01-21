import { Inject, Injectable } from '@nestjs/common';
import { PostDocument } from './posts.entity';
import { PostsRepository } from './repositories/posts.repository';
import { DomainException } from '../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../core/exceptions/domain-exception-codes';

@Injectable()
export class PostService {
  constructor(
    @Inject(PostsRepository) private postsRepository: PostsRepository,
  ) {}

  async findPostById(postId: string): Promise<PostDocument> {
    const foundedPost = await this.postsRepository.findPostsById(postId);
    if (!foundedPost) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'postId',
        message: 'Post not found.',
      });
    }
    return foundedPost;
  }
}
