/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.Tasks.Actions;

/**
 *
 * @author matmey
 */
import java.util.HashMap;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.List;
import javax.mail.Address;

public class SendMail {

    public static void send(HashMap<String, Object> parameters) {
        String subject = (String) parameters.get("subject");
        String text = (String) parameters.get("text");
        String from = (String) parameters.get("from");
        List<String> receivers = (List<String>) parameters.get("receivers");

        final String username = ""; //load username from profile
        final String password = ""; //load password from profile
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
<<<<<<< HEAD
        props.put("mail.smtp.ssl.trust", "");
        props.put("mail.smtp.host", "");
        props.put("mail.smtp.port", "");
=======
        props.put("mail.smtp.ssl.trust", "smtp.vzwgo.be");
        props.put("mail.smtp.host", "smtp.vzwgo.be");
        props.put("mail.smtp.port", "587");
>>>>>>> origin/master

        Session session = Session.getInstance(props,
                new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {

            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.setRecipients(Message.RecipientType.TO,
                    InternetAddress.parse(String.join(",", receivers.toArray(new String[receivers.size()]))));
            message.setSubject(subject);
            message.setText(text);

            Transport.send(message);

            System.out.println("Done");

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}
