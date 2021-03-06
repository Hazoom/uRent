package bl;

import dao.CategoryDAO;
import dao.CustomerDAO;
import dao.ItemDAO;
import dao.MessageDAO;
import dao.RentDAO;
import exportBeans.UserMessageBean;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import java.util.List;

/**
 * User: Ran
 * Date: 25/10/14
 * Time: 21:00
 * This action is called from the login form.
 * Deals with login and logout of customer.
 */
@Path("/MessageService")
@Stateless
public class MessageBL {
    @EJB
    private MessageDAO messageManager;

    @EJB
    private CustomerDAO customerManager;

    @EJB
    private CategoryDAO categoryManager;

    @EJB
    private ItemDAO itemManager;

    @EJB
    private RentDAO rentManager;

    public MessageBL(){
    }

    /**
     *
     * @return
     */
    @Path("/Reply")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public UserMessageBean sendMessage(String JsonObject){
        JSONObject json = null;

        UserMessageBean messageReplied = null;

        try {
            json = (JSONObject) new JSONParser().parse(JsonObject);
            String loginDetails = json.get("CCC").toString();
            int rentId = Integer.parseInt(json.get("RentId").toString());
            String content = json.get("Content").toString();

            int customerId = customerManager.validateLogin(loginDetails);

            if (customerId != 0 &&
                    !content.isEmpty()) {
                    messageReplied = messageManager.sendMessage(customerId, rentId, content);
            }

        } catch (Exception e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }

        return messageReplied;
    }

    /**
     *
     * @return
     */
    @Path("/Conversation")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserMessageBean> populateConversation(String JsonObject){
        JSONObject json = null;

        List<UserMessageBean> conversation = null;

        try {
            json = (JSONObject) new JSONParser().parse(JsonObject);
            String loginDetails = json.get("CCC").toString();
            int rentId = Integer.parseInt(json.get("RentId").toString());

            int customerId = customerManager.validateLogin(loginDetails);

            if (customerId != 0){
            	conversation = messageManager.getRentConversation(rentId, customerId);
            }
        } catch (Exception e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }

        return conversation;
    }
}
