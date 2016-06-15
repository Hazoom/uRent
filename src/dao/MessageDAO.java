package dao;

import exportBeans.UserMessageBean;
import javax.ejb.Local;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: Ran
 * Date: 25/10/14
 * Time: 23:16
 * To change this template use File | Settings | File Templates.
 */
@Local
public interface MessageDAO {
	public UserMessageBean sendMessage(int SenderId, int RentId, String Content);
    public List<UserMessageBean> getRentConversation(int RentId, int customerId);
}
