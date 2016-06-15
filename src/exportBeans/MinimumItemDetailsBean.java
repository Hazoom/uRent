package exportBeans;

import entities.ItemEntity;

/**
 * Created with IntelliJ IDEA.
 * User: Ran
 * Date: 16/01/15
 * Time: 15:41
 * To change this template use File | Settings | File Templates.
 */
public class MinimumItemDetailsBean {
	
	private int itemId;
	private String itemName;

    public MinimumItemDetailsBean(ItemEntity Item) {
    	this.itemId = Item.getId();
    	this.itemName = Item.getItemName();
    }

	public int getItemId() {
		return itemId;
	}

	public void setItemId(int itemId) {
		this.itemId = itemId;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}
}
