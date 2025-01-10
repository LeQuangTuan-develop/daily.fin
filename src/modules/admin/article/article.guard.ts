import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { InjectConnection } from "@nestjs/typeorm"
import { Connection } from "typeorm"
import { DatabaseModule } from "../../../database.module"
import { DATABASE } from "../../../app.constants"
import { ArticleDetailServiceCommon } from "./articleDetail.service"

@Injectable()
export abstract class ArticleGuard implements CanActivate {
  protected constructor(
    @InjectConnection(DatabaseModule.getConnectionName(DATABASE.NAMES.SKIJAN))
    protected skijanConnection: Connection,
    protected readonly articleDetailService: ArticleDetailServiceCommon,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    return await this.guardArticle(request)
  }

  private async guardArticle(request): Promise<boolean> {
    const { userId } = request.metaData
    const articleId = parseInt(request.params.id)
    if (!articleId) {
      throw new Error("Bad request")
    }
    return await this.articleDetailService.validateArticle(userId, articleId)
  }
}
