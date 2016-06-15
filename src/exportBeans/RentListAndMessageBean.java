package exportBeans;

import entities.RentEntity;
import entities.UserMessageEntity;
import exportBeans.Self.RentListSelfBean;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: Ran
 * Date: 16/01/15
 * Time: 15:41
 * To change this template use File | Settings | File Templates.
 */
public class RentListAndMessageBean {
	
	private List<Object> rentMessage;

    public RentListAndMessageBean(RentEntity Rent, UserMessageEntity UserMessage, int OwnerId) {
    	this.rentMessage = new ArrayList<Object>();
    	
    	this.rentMessage.add(new RentListSelfBean(Rent, OwnerId));
    	
    	UserMessageBean msg = new UserMessageBean(UserMessage, OwnerId);
    	int idSwitch = msg.getReceiverId();
    	msg.setReceiverId(msg.getSenderId());
    	msg.setSenderId(idSwitch);
    	
    	this.rentMessage.add(msg);
    }

	public List<Object> getRentMessage() {
		return rentMessage;
	}

	public void setRentMessage(List<Object> rentMessage) {
		this.rentMessage = rentMessage;
	}
}
