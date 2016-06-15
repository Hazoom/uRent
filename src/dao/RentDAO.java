package dao;

import application.ApplicationConstants;
import exportBeans.*;
import exportBeans.Abstract.RentDetailsSuperBean;
import exportBeans.Abstract.RentListSuperBean;

import javax.ejb.Local;
import java.text.DateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: Ran
 * Date: 01/11/14
 * Time: 23:36
 * To change this template use File | Settings | File Templates.
 */
@Local
public interface RentDAO {
    public int startRent(int BuyerId, int ItemId, Date RentFrom, Date RentTo);
    public boolean approve(int CustomerId, int RentId);
    public boolean insertItemDescpritionPreRent(int CustomerId, int RentId, String Description);
    public boolean inRent(int CustomerId, int RentId);
    public boolean end(int CustomerId, int RentId);
    public ApplicationConstants.RentStatus cancel(int RentId, int CustomerId, String Reason);
    public boolean changeRentDates(int RentId, int CustomerId, Date RentFrom, Date RentTo);
    public boolean rateRentBuyer(int RentId, int BuyerRate, String BuyerFeedback);
    public boolean rateRentSupplierAndItem(int RentId, int SupplierRate, String SupplierFeedback, int ItemRate, String ItemFeedback);
    public boolean isItemCanBeRentedInDates(int ItemId, int CustomerId, Date RentFrom, Date RentTo);
    public List<Object> getBuyerRents(int BuyerId, int PageNum, int ResultsPerPage);
    public List<Object> getBuyerRents(int BuyerId, int StatusId, int PageNum, int ResultsPerPage);
    public List<Object> getSupplierRents(int SupplierId, int PageNum, int ResultsPerPage);
    public List<Object> getSupplierRents(int SupplierId, int StatusId, int PageNum, int ResultsPerPage);
    public List<Object> getItemRents(int ItemId, int CustomerId, int PageNum, int ResultsPerPage);
    public List<Object> getItemRents(int ItemId, int CustomerId, int StatusId, int PageNum, int ResultsPerPage);
    public List<Object> getItemRents(int ItemId, int CustomerId, Date startDate, Date endDate, int PageNum, int ResultsPerPage);
    public List<FeedbackBuyerBean> getBuyerFeedback(int BuyerId, int PageNum, int ResultAmount);
    public List<FeedbackSupplierBean> getSupplierFeedback(int SupplierId, int PageNum, int ResultsAmount);
    public List<FeedbackItemBean> getItemFeedback(int ItemId, int PageNum, int ResultsAmount);
    public List<RentScheduleBean> getItemRentsSchedule(int ItemId, Date startDate, Date endDate, DateFormat DF);
    public List<RentListSuperBean> getNeededBuyerRateRent(int BuyerId);
    public List<RentListSuperBean> getNeededSupplierOrItemRateRent(int SupplierId);
    public long getCustomerSumRentNotificationsCount(int CustomerId);
	public RentDetailsSuperBean populateRentDetails(int CustomerId, int RentId);
}