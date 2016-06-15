package dao;

import application.ApplicationConstants;
import exportBeans.Abstract.ItemDetailsSuperBean;
import exportBeans.FeedbackItemBean;
import exportBeans.RentScheduleBean;
import entities.ItemEntity;
import entities.ItemPhotoEntity;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;

import javax.ejb.Local;
import java.util.HashMap;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: Ran
 * Date: 01/11/14
 * Time: 23:36
 * To change this template use File | Settings | File Templates.
 */
@Local
public interface ItemDAO {
    public boolean addItem(int CustomerId, String ItemName, String Description,
                           int CategoryId, Float DailyPrice, Float WeeklyPrice, Float MonthlyPrice, Float Value,
                           HashMap<String, String> lstItemPhotoIds);
    public int addItemPhoto(int CustomerId, Integer ItemId, InputPart inputPart);

    public boolean updateItem(int ItemId, String ItemName, String Description, int CategoryId, boolean Availability,
                              Float DailyPrice, Float WeeklyPrice, Float MonthlyPrice, Float Value,
                              HashMap<String, String> lstItemPhotoIds);

    public boolean deleteItem(int ItemId, int customerID);
    public boolean deleteItemPhoto(int ItemPhotoId);

    public ItemEntity getItemById(int ItemId);
    public ItemPhotoEntity getItemPhotoById(int ItemPhotoId);

    public List<Object> getItemsByBestMatch(String SearchParameters, int PageNum, int ResultsAmount,
            										int CustomerId, ApplicationConstants.OrderByOrder Order);

    public List<Object> getItemsByDistance(String SearchParameters, int PageNum, int ResultsAmount,
            										int CustomerId, ApplicationConstants.OrderByOrder Order);

    public List<Object> getItemsByRentCount(String SearchParameters, int PageNum, int ResultsAmount,
        											int CustomerId, ApplicationConstants.OrderByOrder Order);

    public List<Object> getItemsByDatePublished(String SearchParameters, int PageNum, int ResultsAmount,
            									  	int CustomerId, ApplicationConstants.OrderByOrder Order);

    public List<Object> getItemsByDailyPrice(String SearchParameters, int PageNum, int ResultsAmount,
                                                  	int CustomerId, ApplicationConstants.OrderByOrder Order);

    public List<Object> getItemsByWeeklyPrice(String SearchParameters, int PageNum, int ResultsAmount,
            										int CustomerId, ApplicationConstants.OrderByOrder Order);

    public List<Object> getItemsByMonthlyPrice(String SearchParameters, int PageNum, int ResultsAmount,
            										int CustomerId, ApplicationConstants.OrderByOrder Order);

    public List<Object> getItemsByValue(String SearchParameters, int PageNum, int ResultsAmount,
            										int CustomerId, ApplicationConstants.OrderByOrder Order);

    public List<Object> getItemsByRate(String SearchParameters, int PageNum, int ResultsAmount,
            										int CustomerId, ApplicationConstants.OrderByOrder Order);

    public List<ItemPhotoEntity> getPhotosOfItem(int ItemId);

    public ItemDetailsSuperBean populateFullItemDetails(int ItemId, int CustomerId,
                                                      List<FeedbackItemBean> Feedback,
                                                      List<RentScheduleBean> Rents);
}
