package exportBeans.Abstract;

import entities.CategoryEntity;
import entities.ItemEntity;
import entities.PriceEmbeddable;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 01/11/14
 * Time: 02:27
 * To change this template use File | Settings | File Templates.
 */
public abstract class ItemListSuperBean {

    protected final int SUMMARY_OF_ITEM_DESCRIPTION_LENGTH = 20;

    protected int id;
    protected String name;
    protected String description;

    protected Date datePublished;

    protected int categoryId;
    protected String categoryName;

    protected int rentCount;
    protected double rate;

    protected double ownerDistance;

    protected Float dailyPrice;
    protected Float weeklyPrice;
    protected Float monthlyPrice;
    protected Float value;

    protected String mainPhoto;

	protected int ownerId;
    protected String ownerName;

    public ItemListSuperBean(ItemEntity Item,
                             String Photo) {
        this.id = Item.getId();
        this.name = Item.getItemName();
        this.description = (Item.getDescription().length() > SUMMARY_OF_ITEM_DESCRIPTION_LENGTH ?
                Item.getDescription().substring(0, SUMMARY_OF_ITEM_DESCRIPTION_LENGTH) + ".." :
                Item.getDescription());

        this.datePublished = Item.getDatePublished();

        CategoryEntity category = Item.getThisCategory();
        this.categoryId = category.getId();
        this.categoryName = category.getCategoryname();

        this.rentCount = Item.getRentCount();
        this.rate = Item.getRate();

        PriceEmbeddable price = Item.getThisPrice();

        if (price != null) {
            this.dailyPrice = price.getDay();
            this.weeklyPrice = price.getWeek();
            this.monthlyPrice = price.getMonth();
            this.value = price.getValue();
        }
        
        this.ownerId = Item.getThisCustomer().getId();
        this.ownerName = Item.getThisCustomer().getFirstname() + " " + Item.getThisCustomer().getLastname();

        this.mainPhoto = Photo;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDatePublished() {
        return datePublished;
    }

    public void setDatePublished(Date datePublished) {
        this.datePublished = datePublished;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public int getRentCount() {
        return rentCount;
    }

    public void setRentCount(int rentCount) {
        this.rentCount = rentCount;
    }

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }

    public double getOwnerDistance() {
        return ownerDistance;
    }

    public void setOwnerDistance(double ownerDistance) {
        this.ownerDistance = ownerDistance;
    }

    public Float getDailyPrice() {
        return dailyPrice;
    }

    public void setDailyPrice(Float dailyPrice) {
        this.dailyPrice = dailyPrice;
    }

    public Float getWeeklyPrice() {
        return weeklyPrice;
    }

    public void setWeeklyPrice(Float weeklyPrice) {
        this.weeklyPrice = weeklyPrice;
    }

    public Float getMonthlyPrice() {
        return monthlyPrice;
    }

    public void setMonthlyPrice(Float monthlyPrice) {
        this.monthlyPrice = monthlyPrice;
    }

    public Float getValue() {
        return value;
    }

    public void setValue(Float value) {
        this.value = value;
    }

    public String getMainPhoto() {
        return mainPhoto;
    }

    public void setMainPhoto(String mainPhoto) {
        this.mainPhoto = mainPhoto;
    }
    
    public int getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(int ownerId) {
		this.ownerId = ownerId;
	}

	public String getOwnerName() {
		return ownerName;
	}

	public void setOwnerName(String ownerName) {
		this.ownerName = ownerName;
	}
}
