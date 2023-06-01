
//exports.handler = async (data) => {
  const { EmailClient } = require("@azure/communication-email");
  require("dotenv").config();
  const connectionString = 'endpoint=https://csisw.communication.azure.com/;accesskey=7d6cdvAVofF4Et0hzrUa15nmUeOzcLR0w3eY0TgTwgbWxs/sfqAk/W/btcNoiUCUhxo/PQP7fXzE/6U10fjyMQ==';
  const emailClient = new EmailClient(connectionString);

async function envio_mail(asunto, receptor, msg, para){
  console.log('------> ' + asunto)
  console.log('------> ' + receptor)
  console.log('------> ' + msg)
  console.log('------> ' + para)


  const POLLER_WAIT_TIME = 10
  try {
    const message = {
      senderAddress: "DoNotReply@db4bc562-46ab-4067-8353-24c78dcc06b4.azurecomm.net",
      content: {
        subject: asunto,
        plainText: msg
      },
      recipients: {
        to: [
          {
            address: receptor,
            displayName: para
          },
        ],
      },
    };

    const poller = await emailClient.beginSend(message);

    if (!poller.getOperationState().isStarted) {
      throw "Poller was not started."
    }

    let timeElapsed = 0;
    while(!poller.isDone()) {
      poller.poll();
      console.log("Email send polling in progress");

      await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
      timeElapsed += 10;

      if(timeElapsed > 18 * POLLER_WAIT_TIME) {
        throw "Polling timed out.";
      }
    }

    if(poller.getResult().status === KnownEmailSendStatus.Succeeded) {
      console.log(`Successfully sent the email (operation id: ${poller.getResult().id})`);
    }
    else {
      throw poller.getResult().error;
    }
  } catch (e) {
    console.log(e);
  }
}

 module.exports = {
    envio_mail : envio_mail
 }
//}

