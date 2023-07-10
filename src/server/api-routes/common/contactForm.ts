import Mailer from '../../lib/common/Mailer';
import { rateLimitByIP } from '../../lib/common/rateLimit';
import { createRouter } from '../../core/server';
import { DEBUG } from '../../core/errors';

const contactFormRouter = createRouter();

contactFormRouter.Post("/api/contact/email", async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const rate = await rateLimitByIP(ip, 2500);
    if(rate === true) {
      const text = `Lähettäjän sähköpostiosoite: ${req.body.from}\r\n\r\n${req.body.text}`
      Mailer.sendMail({ from: req.body.from, replyTo: req.body.from, sender: req.body.from, to: req.body.to, subject: req.body.subject, text: text});
    }
    return res.status(200).json({ result: "success", message: "Contact request has been sent."})
  } catch (error) {
    DEBUG.log(error);
    if (typeof error === "object" && error !== null) {
      return res.status(500).json({ result: "error", message: error.toString() });
    } else {
      return res.status(500).json({ result: "error", message: "Unknown error" });
    }
  }
});

export {
  contactFormRouter,
}

