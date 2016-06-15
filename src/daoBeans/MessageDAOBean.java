package daoBeans;

import dao.MessageDAO;
import exportBeans.RentListAndMessageBean;
import exportBeans.UserMessageBean;
import exportBeans.Abstract.RentListSuperBean;
import entities.CustomerEntity;
import entities.RentEntity;
import entities.UserMessageEntity;

import org.hibernate.Session;
import org.json.simple.JSONObject;

import com.google.gson.*;

import application.WebSocket;

import javax.ejb.Stateless;
import javax.persistence.*;

import java.io.StringWriter;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: Ran
 * Date: 25/10/14
 * Time: 23:16
 * To change this template use File | Settings | File Templates.
 */
@Stateless
public class MessageDAOBean implements MessageDAO {

    @PersistenceContext(unitName="WhyBuyPersistenceUnit")
    private EntityManager manager;

    public MessageDAOBean() {}
    
    /**
     * 
     */
    @Override
    public UserMessageBean sendMessage(int SenderId, int RentId, String Content){
    	UserMessageBean messageReplied = null;
    	
    	try{
        	RentEntity rent = manager.find(RentEntity.class, RentId);
        	
        	int receiverId;
        	
        	if (SenderId == rent.getThisBuyer().getId()){
        		rent.setLastBuyerAction(new Timestamp(new Date().getTime()));
        		receiverId = rent.getThisSupplier().getId();
        	}
        	else {
        		rent.setLastSupplierAction(new Timestamp(new Date().getTime()));
    			receiverId = rent.getThisBuyer().getId();
        	}

        	UserMessageEntity message = new UserMessageEntity(manager.find(CustomerEntity.class, SenderId),
                                            				  manager.find(CustomerEntity.class, receiverId),
                                    				  		  rent, Content);
        	
            manager.persist(message);
            manager.merge(rent);

            messageReplied = this.convertEntity(message, SenderId);

            this.sendRentMessageJson(this.convertRentMessageEntity(message, SenderId));
        } catch (Exception e) {
            e.printStackTrace();
        }

        return messageReplied;
    }

    /**
     *
     * @param MessageId
     * @return
     */
    @Override
    public List<UserMessageBean> getRentConversation(int RentId, int customerId){
        List<UserMessageBean> messageTree = null;
        
        try{
            manager.unwrap(Session.class).enableFilter("rent").setParameter("rentId", RentId);

            List<UserMessageEntity> conversation = manager
                    .createNamedQuery("UserMessage.DateSentAsc", UserMessageEntity.class)
                    .getResultList();
            
            manager.unwrap(Session.class).disableFilter("rent");
            
            if (!conversation.isEmpty() &&
            		(conversation.get(0).getThisSender().getId() == customerId ||
            			conversation.get(0).getThisReceiver().getId() == customerId)){
	            messageTree = new ArrayList<UserMessageBean>();
	            for (int i = 0; i < conversation.size(); i++){
	            	messageTree.add(this.convertEntity(conversation.get(i), customerId));
	            }
            }
        }catch(Exception e){
        	e.printStackTrace();
        }

        return messageTree;
    }
    
    /**
     * 
     * @param RentMessage
     * @return
     */
    @SuppressWarnings("unchecked")
	private boolean sendRentMessageJson(RentListAndMessageBean RentMessage){
    	boolean isSent = false;
        
        try{
            String rentMessageJSON = new Gson().toJson(RentMessage);
            
            for (javax.websocket.Session s : WebSocket.connectedUsers.keySet()){
            	if (WebSocket.connectedUsers.get(s) != null &&
            			WebSocket.connectedUsers.get(s) == ((RentListSuperBean) RentMessage.getRentMessage().get(0)).getOtherId()){		
                    JSONObject main = new JSONObject();
                    main.put("event", "message");
                	main.put("data", rentMessageJSON);
                	
                    StringWriter out = new StringWriter();
                    
                	main.writeJSONString(out);
                	
            		s.getAsyncRemote().sendText(out.toString());
            	}
            }
            
            isSent = true;
        } catch(Exception e){
        	e.printStackTrace();
        }
        
        return isSent;
    }

    /**
     *
     * @param UserMessage
     * @return
     */
    private UserMessageBean convertEntity(UserMessageEntity UserMessage, int OwnerId){
        UserMessageBean message = null;

        try{
            message = new UserMessageBean(UserMessage, OwnerId);
        }catch(Exception e){
            e.printStackTrace();
        }

        return message;
    }

    /**
     *
     * @param UserMessage
     * @return
     */
    private RentListAndMessageBean convertRentMessageEntity(UserMessageEntity UserMessage, int OwnerId){
    	RentListAndMessageBean rentMessage = null;

        try{
        	rentMessage = new RentListAndMessageBean(UserMessage.getThisRent(), UserMessage, OwnerId);
        }catch(Exception e){
            e.printStackTrace();
        }

        return rentMessage;
    }
}
