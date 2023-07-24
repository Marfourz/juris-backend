import { Injectable } from '@nestjs/common';
import { DiscussionDocument } from '../discussions/discussions.schema';
import { MessageDocument, MessageType } from '../messages/messages.schema';
const { Configuration, OpenAIApi } = require('openai');

@Injectable()
export class GptService {
//   constructor() {
//     const configuration = new Configuration({
//       apiKey: process.env.GPT_KEY,
//     });
//     const openai = new OpenAIApi(configuration);
//   }

  async sendMessage(messages : Array<MessageDocument>) {
    const configuration = new Configuration({
      apiKey: process.env.GPT_KEY,
    });
    console.log('gpt key',process.env.GPT_KEY )
    const openai = new OpenAIApi(configuration);

    const chatGptMessages = [
        { role: "system", content: "Tu es un chatbot qui permet de discuter sur la légitimité d'un acte." },
        { role: "system", content: "Tu te basera sur les loies du Bénin" },
        { role: "system", content: "Ton nom est Juris" },
    ]

    messages.forEach((message : MessageDocument)=>{
        chatGptMessages.push({
            role: message.type == MessageType.CHATBOT ? "assistant" : "user",
            content : message.text
        })
    })

    let response

    try{
        response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: chatGptMessages,
            temperature: 0.5,
            max_tokens: 256
          });
    }
    catch(error){
        console.log('gpt error', error)
    }

    return response.data.choices[0].message.content
  }
}
