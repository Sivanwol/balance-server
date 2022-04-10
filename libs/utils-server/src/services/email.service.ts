import * as sendgrid from '@sendgrid/mail';
import { Service } from 'typedi';
import { IKeyValueObject, IMailerData, MailerData } from '../constraints/mailerData';

@Service()
export class EmailService {
  public async sendEmail(toSent: string, key: string, data: IMailerData): Promise<void> {
    const metaData = MailerData[key];
    if (!metaData) throw new Error(`Meta data key ${key} has no template defined`)
    if (!this.validateEmail(toSent)) throw new Error(`Unable sent email as to ${toSent} it not an valid email`)
    const mailerParams = this.GetKeyValueObject(data.dataParams)
    const titleKeyValueParams = this.GetKeyValueObject(data.titleParams)
    // @ts-ignore
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: process.env.MAIL_FROM,
      from: toSent,
      templateId: metaData.template,
      dynamicTemplateData: {
        subject: metaData.title(titleKeyValueParams),
        ...mailerParams
      },
    };
    console.log(msg)
    await sendgrid.send(msg)
  }
  private GetKeyValueObject(data: IKeyValueObject[]) {
    const returnValue = {}
    for (const item of data) {
      returnValue[item.key] = item.value
    }
    return returnValue
  }
  private validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
