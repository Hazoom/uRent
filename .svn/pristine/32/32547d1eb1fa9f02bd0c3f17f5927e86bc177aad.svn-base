package application;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import dao.CustomerDAO;

@ServerEndpoint("/check")
@Stateless
public class WebSocket {
	public static Map<Session, Integer> connectedUsers = Collections.synchronizedMap(new HashMap<Session, Integer>());
	
	@EJB
	private CustomerDAO customerManager;
	
    @SuppressWarnings("unchecked")
	@OnOpen
    public void onOpen(Session session) throws IOException{
        System.out.println(session.getId() + " has opened a connection");
        
        if (!connectedUsers.containsKey(session)){
        	connectedUsers.put(session, null);

            JSONObject main = new JSONObject();
            main.put("event", "o");
        	
        	session.getAsyncRemote().sendText(main.toString());
        }
    }
    
    @OnMessage
    public void onMessage(String message, Session session){
        JSONObject json = null;
        try {
            json = (JSONObject) new JSONParser().parse(message);
            
            if (((String) json.get("event")).equals("ccc")){
		    	int CustomerId = this.customerManager.validateLogin((String) json.get("data"));
		    	
		    	if (CustomerId > 0){
		    		connectedUsers.put(session, CustomerId);
		    	}
            }
        }catch(Exception e){
        	e.printStackTrace();
        }
    }
    
    @OnClose
    public void onClose(Session session){
        System.out.println("Session " +session.getId()+" has ended");
        
        connectedUsers.remove(session);
    }
}
