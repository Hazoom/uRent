package exportBeans.Defined;

import exportBeans.ItemPhotoBean;
import entities.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 01/11/14
 * Time: 02:27
 * To change this template use File | Settings | File Templates.
 */
public class ItemDetailsDefinedBean {

    private int id;
    private String name;
    private String description;

    private int categoryId;
    private String categoryName;

    private boolean availability;

    private Float dailyPrice;
    private Float weeklyPrice;
    private Float monthlyPrice;
    private Float value;

    private List<ItemPhotoBean> lstPhotos;

    public ItemDetailsDefinedBean(ItemEntity Item,
                                  List<ItemPhotoEntity> Photos,
                                  CategoryEntity category){

        this.id = Item.getId();
        this.name = Item.getItemName();
        this.description = Item.getDescription();

        this.categoryId = category.getId();
        this.categoryName = category.getCategoryname();

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

    public boolean isAvailability() {
        return availability;
    }

    public void setAvailability(boolean availability) {
        this.availability = availability;
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
}
