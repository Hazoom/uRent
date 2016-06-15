package exportBeans.Abstract;

import entities.ItemEntity;
import entities.RentEntity;

/**
 * Created with IntelliJ IDEA.
 * User: Ran
 * Date: 16/01/15
 * Time: 15:41
 * To change this template use File | Settings | File Templates.
 */
public abstract class RentListSuperBean {

    protected int id;

    protected long startRent;
    protected long endRent;

    protected int otherId;
    protected String otherName;

    protected int statusId;
    protected String statusDescription;

    protected int itemId;
    protected String itemName;
    
    protected boolean isNew;

    public RentListSuperBean(RentEntity Rent) {
        this.id = Rent.getId();

        this.startRent = Rent.getRentfromdate().getTime();
        this.endRent = Rent.getRenttodate().getTime();

        ItemEntity item = Rent.getThisItem();
        this.itemId = item.getId();
        this.itemName = item.getItemName();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

	public long getStartRent() {
        return startRent;
    }

    public void setStartRent(long startRent) {
        this.startRent = startRent;
    }

    public long getEndRent() {
        return endRent;
    }

    public void setEndRent(long endRent) {
        this.endRent = endRent;
    }

    public int getOtherId() {
        return otherId;
    }

    public void setOtherId(int otherId) {
        this.otherId = otherId;
    }

    public String getOtherName() {
        return otherName;
    }

    public void setOtherName(String otherName) {
        this.otherName = otherName;
    }

    public int getStatusId() {
        return statusId;
    }

    public void setStatusId(int statusId) {
        this.statusId = statusId;
    }

    public String getStatusDescription() {
        return statusDescription;
    }

    public void setStatusDescription(String statusDescription) {
        this.statusDescription = statusDescription;
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

    public boolean getIsNew() {
		return isNew;
	}

	public void setIsNew(boolean isNew) {
		this.isNew = isNew;
	}
}
