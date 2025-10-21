import { Submission, SubmissionStatus, UserAccount } from '@prisma/client';
import { ResponseUserDto } from '../../user/dto/response-user.dto';

export class ResponseSubmissionDto {
  id: string;
  advisorId: string;
  mainAuthorId: string;
  mainAuthor?: ResponseUserDto;
  eventEditionId: string;
  title: string;
  abstract: string;
  pdfFile: string;
  phoneNumber: string;
  proposedPresentationBlockId?: string;
  proposedPositionWithinBlock?: number;
  proposedStartTime?: Date;
  coAdvisor?: string;
  status: SubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
  advisor?: ResponseUserDto;

  constructor(
    submission: Submission & { mainAuthor?: UserAccount } & {
      advisor?: UserAccount;
    },
    proposedStartTime?: Date,
  ) {
    this.id = submission.id;
    this.advisorId = submission.advisorId;
    this.mainAuthorId = submission.mainAuthorId;
    this.mainAuthor = submission.mainAuthor
      ? new ResponseUserDto(submission.mainAuthor)
      : null;
    this.advisor = submission.advisor
      ? new ResponseUserDto(submission.advisor)
      : null;
    this.eventEditionId = submission.eventEditionId;
    this.title = submission.title;
    this.abstract = submission.abstract;
    this.pdfFile = submission.pdfFile;
    this.phoneNumber = submission.phoneNumber;
    this.proposedPresentationBlockId = submission.proposedPresentationBlockId;
    this.proposedPositionWithinBlock = submission.proposedPositionWithinBlock;
    this.proposedStartTime = proposedStartTime;
    this.coAdvisor = submission.coAdvisor;
    this.status = submission.status;
    this.createdAt = submission.createdAt;
    this.updatedAt = submission.updatedAt;
  }
}
