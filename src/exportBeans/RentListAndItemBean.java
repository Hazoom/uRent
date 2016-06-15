package exportBeans;

import entities.ItemEntity;
import entities.RentEntity;
import exportBeans.Abstract.RentListSuperBean;
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
public class RentListAndItemBean {
	
	private List<Object> itemRentList;

    public RentListAndItemBean(List<RentEntity> lstEntity, ItemEntity Item, int OwnerId) {
    	if (Item != null &&
    			Item.getThisCustomer().getId() == OwnerId){
	    	this.itemRentList = new ArrayList<Object>();
	
	        List<RentListSuperBean> rents = new ArrayList<RentListSuperBean>();
	        
	        for (RentEntity rent : lstEntity){
	            rents.add(new RentListSelfBean(rent, OwnerId));
	        }
	        
	    	this.itemRentList.add(rents);
	    	this.itemRentList.add(new MinimumItemDetailsBean(Item));
    	}
    }

	public List<Object> getItemRentList() {
		return itemRentList;
	}

	public void setItemRentList(List<Object> itemRentList) {
		this.itemRentList = itemRentList;
	}
}
