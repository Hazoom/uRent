package exportBeans;

import entities.CustomerEntity;
import entities.UserMessageEntity;

/**
 * Created with IntelliJ IDEA.
 * User: Ran
 * Date: 16/01/15
 * Time: 15:41
 * To change this template use File | Settings | File Templates.
 */
public class UserMessageBean {

    private int id;

    private int ownerId;

    private int senderId;
    private int receiverId;
    
    private int rentId;

    private long dateSent;
    private String content;

    public UserMessageBean(UserMessageEntity UserMessage, int ownerId) {
        this.id = UserMessage.getId();

        this.ownerId = ownerId;

        CustomerEntity sender = UserMessage.getThisSender();
        this.senderId = sender.getId();

        CustomerEntity receiver = UserMessage.getThisReceiver();
        this.receiverId = receiver.getId();
        
        this.rentId = UserMessage.getThisRent().getId();

        this.dateSent = UserMessage.getDateSent().getTime();
        this.content = UserMessage.getContent();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    public int getSenderId() {
        return senderId;
    }

    public void setSenderId(int senderId) {
        this.senderId = senderId;
    }

    public int getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(int receiverId) {
        this.receiverId = receiverId;
    }

    public int getRentId() {
        return rentId;
    }

    public void setRentId(int rentId) {
        this.rentId = rentId;
    }
    
    public long getDateSent() {
        return dateSent;
    }

    public void setDateSent(long dateSent) {
        this.dateSent = dateSent;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
