package exportBeans.Abstract;

import exportBeans.FeedbackItemBean;
import exportBeans.ItemPhotoBean;
import exportBeans.RentScheduleBean;
import entities.*;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 01/11/14
 * Time: 02:27
 * To change this template use File | Settings | File Templates.
 */
public abstract class ItemDetailsSuperBean {

    protected int id;
    protected String name;
    protected String description;

    protected String datePublished;

    protected int categoryId;
    protected String categoryName;

    protected int parentCategoryId;
    protected String parentCategoryName;

    protected int rentCount;
    protected float rate;
    protected int rateCount;
    protected boolean availability;

    protected int ownerId;
    protected String ownerName;
    protected float ownerRate;
    protected int ownerRateCount;
    protected double ownerDistance;

    protected Float dailyPrice;
    protected Float weeklyPrice;
    protected Float monthlyPrice;
    protected Float value;

    protected List<ItemPhotoBean> lstPhotos;

    protected List<FeedbackItemBean> lstFeedback;

    protected List<RentScheduleBean> lstRents;

    public ItemDetailsSuperBean(ItemEntity Item,
                                List<ItemPhotoEntity> Photos,
                                List<FeedbackItemBean> Feedback,
                                List<RentScheduleBean> Rents,
                                CategoryEntity Category,
                                CategoryEntity ParentCategory){

        this.id = Item.getId();
        this.name = Item.getItemName();
        this.description = Item.getDescription();

        this.datePublished = new SimpleDateFormat("dd/MM/yyyy").format(Item.getDatePublished());

        this.categoryId = Category.getId();
        this.categoryName = Category.getCategoryname();

        if (ParentCategory != null) {
            this.parentCategoryId = ParentCategory.getId();
            this.parentCategoryName = ParentCategory.getCategoryname();
        }

        this.rentCount = Item.getRentCount();
        this.rate = Item.getRate();
        this.rateCount = Item.getRateCount();
        this.availability = Item.getAvailability();

        PriceEmbeddable price = Item.getThisPrice();
        if (price != null) {
            this.dailyPrice = price.getDay();
            this.weeklyPrice = price.getWeek();
            this.monthlyPrice = price.getMonth();
            this.value = price.getValue();
        }

        if (Photos != null) {
            this.lstPhotos = new ArrayList<ItemPhotoBean>();

            for (ItemPhotoEntity photo : Photos){
                this.lstPhotos.add(new ItemPhotoBean(photo));
            }
        }

        this.lstFeedback = Feedback;

        this.lstRents = Rents;
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

    public String getDatePublished() {
        return datePublished;
    }

    public void setDatePublished(String datePublished) {
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

    public int getParentCategoryId() {
        return parentCategoryId;
    }

    public void setParentCategoryId(int parentCategoryId) {
        this.parentCategoryId = parentCategoryId;
    }

    public String getParentCategoryName() {
        return parentCategoryName;
    }

    public void setParentCategoryName(String parentCategoryName) {
        this.parentCategoryName = parentCategoryName;
    }

    public int getRentCount() {
        return rentCount;
    }

    public void setRentCount(int rentCount) {
        this.rentCount = rentCount;
    }

    public float getRate() {
        return rate;
    }

    public void setRate(float rate) {
        this.rate = rate;
    }

    public int getRateCount() {
        return rateCount;
    }

    public void setRateCount(int rateCount) {
        this.rateCount = rateCount;
    }

    public boolean isAvailability() {
        return availability;
    }

    public void setAvailability(boolean availability) {
        this.availability = availability;
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

    public float getOwnerRate() {
        return ownerRate;
    }

    public void setOwnerRate(float ownerRate) {
        this.ownerRate = ownerRate;
    }

    public int getOwnerRateCount() {
        return ownerRateCount;
    }

    public void setOwnerRateCount(int ownerRateCount) {
        this.ownerRateCount = ownerRateCount;
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

    public List<ItemPhotoBean> getLstPhotos() {
        return lstPhotos;
    }

    public void setLstPhotos(List<ItemPhotoBean> lstPhotos) {
        this.lstPhotos = lstPhotos;
    }

    public List<FeedbackItemBean> getLstFeedback() {
        return lstFeedback;
    }

    public void setLstFeedback(List<FeedbackItemBean> lstFeedback) {
        this.lstFeedback = lstFeedback;
    }

    public List<RentScheduleBean> getLstRents() {
        return lstRents;
    }

    public void setLstRents(List<RentScheduleBean> lstRents) {
        this.lstRents = lstRents;
    }
}
