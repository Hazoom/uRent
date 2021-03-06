package daoBeans;

import application.ApplicationConstants;
import application.WebSocket;
import dao.RentDAO;
import exportBeans.*;
import exportBeans.Abstract.RentDetailsSuperBean;
import exportBeans.Abstract.RentListSuperBean;
import exportBeans.Self.RentDetailsSelfBean;
import exportBeans.Self.RentListSelfBean;
import entities.CustomerEntity;
import entities.FeedbackEntity;
import entities.ItemEntity;
import entities.RentEntity;
import org.hibernate.Session;
import org.json.simple.JSONObject;

import com.google.gson.Gson;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import java.io.StringWriter;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: Ran
 * Date: 01/11/14
 * Time: 23:36
 * To change this template use File | Settings | File Templates.
 */
@Stateless
public class RentDAOBean implements RentDAO {

    @PersistenceContext(unitName="WhyBuyPersistenceUnit")
    private EntityManager manager;

    public RentDAOBean() {}

    /**
     * @param BuyerId
     * @param ItemId
     * @param RentFrom
     * @param RentTo
     * @return
     */
    @Override
    public int startRent(int BuyerId, int ItemId, Date RentFrom, Date RentTo){
        int addStatus = ApplicationConstants.RequestRentStatus.InternalError.ordinal();

        try {
            ItemEntity item = manager.find(ItemEntity.class, ItemId);
            
            if (item.getThisCustomer().getId() != BuyerId){
	            if (this.isItemCanBeRentedInDates(ItemId, BuyerId, RentFrom, RentTo)){
	                FeedbackEntity feedback = new FeedbackEntity();
	
	                RentEntity rent = new RentEntity(RentFrom, RentTo,
	                                                       manager.find(CustomerEntity.class, BuyerId),
	                                                       item.getThisCustomer(),
	                                                       item,
	                                                       feedback);
		
	                manager.persist(rent);
	                
	                addStatus = ApplicationConstants.RequestRentStatus.Success.ordinal();
	                
	                this.sendRentJson(this.convertDetailedEntity(rent, BuyerId));
	            }
	            else{
	            	addStatus = ApplicationConstants.RequestRentStatus.ItemAlreadyRented.ordinal();
	            }
            }
            else{
            	addStatus = ApplicationConstants.RequestRentStatus.SameCustomer.ordinal();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return addStatus;
    }

    /**
     *
     * @param RentId
     * @return
     */
    @Override
    public boolean approve(int CustomerId, int RentId) {
        boolean isStatusProcessed = false;

        RentEntity rent;

        if ((rent = this.getRentById(RentId)) != null &&
    			rent.getThisStatus().equals(ApplicationConstants.RentStatus.Requested) &&
        			rent.getThisSupplier().getId() == CustomerId){
            try {
            	Timestamp time = new Timestamp(new Date().getTime());
                rent.setThisStatus(ApplicationConstants.RentStatus.Approved);
                rent.setLastSupplierAction(time);
                
//                UserMessageEntity approvalMessage = new UserMessageEntity(rent.getThisSupplier(), 
//                													      rent.getThisBuyer(), 
//                													      null, 
//                													      "chat", 
//                													      "Hey, i approved your rent request. let's talk about it!");

                rent.setIsNewBuyer(true);
                
                manager.merge(rent);

                isStatusProcessed = true;
                
                sendRentJson(this.convertDetailedEntity(rent, CustomerId));
            } catch (Exception e) {

                e.printStackTrace();
            }
        }

        return isStatusProcessed;
    }

	@Override
	public boolean insertItemDescpritionPreRent(int CustomerId, int RentId, String Description) {
        boolean isDescirptionAdded = false;

        RentEntity rent;

        try {
        	if ((rent = this.getRentById(RentId)) != null &&
        			rent.getThisStatus().equals(ApplicationConstants.RentStatus.Approved) &&
        				rent.getThisBuyer().getId() == CustomerId){
                rent.setItemDescriptionPreRent(Description);
            	
                Timestamp time = new Timestamp(new Date().getTime());
                rent.setLastBuyerAction(time);

                rent.setIsNewSupplier(true);
                
                manager.merge(rent);

                isDescirptionAdded = true;
                
                sendRentJson(this.convertDetailedEntity(rent, CustomerId));
        	}
        } catch (Exception e) {
            e.printStackTrace();
        }

        return isDescirptionAdded;
	}

    /**
     *
     * @param RentId
     * @param ItemDescriptionPreRent
     * @return
     */
    @Override
    public boolean inRent(int CustomerId, int RentId) {
        boolean isStatusProcessed = false;

        RentEntity rent;

        try {
	        if ((rent = this.getRentById(RentId)) != null &&
	        		rent.getThisSupplier().getId() == CustomerId &&
	        			rent.getThisStatus().equals(ApplicationConstants.RentStatus.Approved) &&
	        				!rent.getItemDescriptionPreRent().isEmpty()){
                rent.setThisStatus(ApplicationConstants.RentStatus.InRent);

                Timestamp time = new Timestamp(new Date().getTime());
                rent.setLastSupplierAction(time);

                rent.setIsNewBuyer(true);
                
                manager.merge(rent);

                isStatusProcessed = true;
                
                sendRentJson(this.convertDetailedEntity(rent, CustomerId));
	        }
        } catch (Exception e) {

            e.printStackTrace();
        }

        return isStatusProcessed;
    }

    /**
     *
     * @param RentId
     * @return
     */
    @Override
    public boolean end(int CustomerId, int RentId) {
        boolean isStatusProcessed = false;

        RentEntity rent;

        try {
        	if ((rent = this.getRentById(RentId)) != null &&
        			rent.getThisStatus().equals(ApplicationConstants.RentStatus.InRent)){
        		ItemEntity item = rent.getThisItem();
        		
                rent.setThisStatus(ApplicationConstants.RentStatus.Ended);

                Timestamp time = new Timestamp(new Date().getTime());
                rent.setLastSupplierAction(time);
                
                if (item != null){
                	item.setRentCount(item.getRentCount() + 1);
                	manager.merge(item);
                }
                
                rent.setIsNewBuyer(true);

                manager.merge(rent);

                isStatusProcessed = true;
                
                sendRentJson(this.convertDetailedEntity(rent, CustomerId));
        	}
        } catch (Exception e) {

            e.printStackTrace();
        }

        return isStatusProcessed;
    }

    /**
     *
     * @param RentId
     * @return
     */
    @Override
    public ApplicationConstants.RentStatus cancel(int RentId, int CustomerId, String Reason) {
        ApplicationConstants.RentStatus status = null;

        RentEntity rent;

        if ((rent = this.getRentById(RentId)) != null){
            try {
                if (CustomerId == rent.getThisBuyer().getId()){
                    rent.setThisStatus(ApplicationConstants.RentStatus.CancelledByBuyer);
                    rent.setLastBuyerAction(new Timestamp(new Date().getTime()));
                    rent.setIsNewSupplier(true);
                }
                else if (CustomerId == rent.getThisSupplier().getId()){
                    rent.setThisStatus(ApplicationConstants.RentStatus.CancelledBySupplier);
                    rent.setLastSupplierAction(new Timestamp(new Date().getTime()));
                    rent.setIsNewBuyer(true);
                }
                
                rent.setCancellationReason(Reason);

                manager.merge(rent);

                status = rent.getThisStatus();
                
                sendRentJson(this.convertDetailedEntity(rent, CustomerId));
            } catch (Exception e) {

                e.printStackTrace();
            }
        }

        return status;
    }

    /**
     *
     * @param RentId
     * @param RentFrom
     * @param RentTo
     * @return
     */
    @Override
    public boolean changeRentDates(int RentId, int CustomerId, Date RentFrom, Date RentTo){
        boolean isRentDatesUpdated = false;

        RentEntity rent;

        try {
        	if ((rent = this.getRentById(RentId)) != null &&
                rent.getThisStatus().ordinal() <= ApplicationConstants.RentStatus.Approved.ordinal() &&
                	(RentFrom != rent.getRentfromdate() ||
                		RentTo != rent.getRenttodate()) && 
                			this.isItemCanBeRentedInDates(rent.getThisItem().getId(), CustomerId, RentFrom, RentTo)){
	            rent.setRentfromdate(RentFrom);
	            rent.setRenttodate(RentTo);
	
	            rent.setThisStatus(ApplicationConstants.RentStatus.Requested);
	            rent.setItemDescriptionPreRent("");
	            rent.setLastBuyerAction(new Timestamp(new Date().getTime()));
	
	            rent.setIsNewSupplier(true);
	            
	            manager.merge(rent);
                isRentDatesUpdated = true;
                
                sendRentJson(this.convertDetailedEntity(rent, CustomerId));
        	}
        } catch (Exception e) {

            e.printStackTrace();
        }

        return isRentDatesUpdated;
    }

    /**
     *
     * @param RentId
     * @param BuyerRate
     * @return
     */
    @Override
    public boolean rateRentBuyer(int RentId, int BuyerRate, String BuyerFeedback){
        boolean isRatingOk = false;

        RentEntity rent;

        if ((rent = this.getRentById(RentId)) != null){
            try {
        		DecimalFormat decimalFormat = new DecimalFormat("###.##");
        		
                rent.setLastSupplierAction(new Timestamp(new Date().getTime()));

                FeedbackEntity feedback = rent.getThisFeedback();

                feedback.setBuyerRate(BuyerRate);
                feedback.setBuyerFeedback(BuyerFeedback);

                if (feedback.getSupplierRate() != null && feedback.getItemRate() != null){
                    rent.setThisStatus(ApplicationConstants.RentStatus.Closed);
                }

                CustomerEntity customer = manager.find(CustomerEntity.class, rent.getThisBuyer().getId());
                int buyerRateCount = customer.getRateasbuyercount();

                customer.setRateasbuyer(Float.parseFloat(
											decimalFormat.format(
													(customer.getRateasbuyer() * buyerRateCount + BuyerRate) /
													(buyerRateCount + 1)
											)
										));
                customer.setRateasbuyercount(buyerRateCount + 1);

                rent.setIsNewBuyer(true);
                
                manager.merge(feedback);
                manager.merge(rent);
                manager.merge(customer);

                isRatingOk = true;
                
                sendRentJson(this.convertDetailedEntity(rent, rent.getThisSupplier().getId()));
            } catch (Exception e) {

                e.printStackTrace();
            }
        }

        return isRatingOk;
    }

    /**
     *
     * @param RentId
     * @param SupplierRate
     * @param SupplierFeedback
     * @return
     */
    @Override
    public boolean rateRentSupplierAndItem(int RentId, int SupplierRate, String SupplierFeedback, int ItemRate, String ItemFeedback){
        boolean isRatingOk = false;

        RentEntity rent;
        try {
        	if ((rent = this.getRentById(RentId)) != null &&
        			rent.getThisStatus().equals(ApplicationConstants.RentStatus.Ended)){
        		DecimalFormat decimalFormat = new DecimalFormat("###.##");
        		
                rent.setLastBuyerAction(new Timestamp(new Date().getTime()));

                FeedbackEntity feedback = rent.getThisFeedback();

                feedback.setSupplierRate(SupplierRate);
                feedback.setSupplierFeedback(SupplierFeedback);

                CustomerEntity customer = manager.find(CustomerEntity.class, rent.getThisSupplier().getId());
                int supplierRateCount = customer.getRateassuppliercount();

                customer.setRateassupplier(Float.parseFloat(
                							decimalFormat.format(
        										(customer.getRateassupplier() * supplierRateCount + SupplierRate) /
    											(supplierRateCount + 1)
											)
                						  ));
                customer.setRateassuppliercount(supplierRateCount + 1);


                feedback.setItemRate(ItemRate);
                feedback.setItemFeedback(ItemFeedback);

                ItemEntity item = manager.find(ItemEntity.class, rent.getThisItem().getId());
                int ItemRateCount = item.getRateCount();

                item.setRate(Float.parseFloat(
								decimalFormat.format(
										(item.getRate() * ItemRateCount + ItemRate) /
										(ItemRateCount + 1)
								)
							));
                item.setRateCount(ItemRateCount + 1);

                if (feedback.getBuyerRate() != null){
                    rent.setThisStatus(ApplicationConstants.RentStatus.Closed);
                }
                
                rent.setIsNewSupplier(true);

                manager.merge(feedback);
                manager.merge(rent);
                manager.merge(item);
                manager.merge(customer);

                isRatingOk = true;
                
                sendRentJson(this.convertDetailedEntity(rent, rent.getThisBuyer().getId()));
        	}	
        } catch (Exception e) {

            e.printStackTrace();
        }

        return isRatingOk;
    }


    /**
     *
     * @param ItemId
     * @param RentFrom
     * @param RentTo
     * @return
     */
    @Override
    public boolean isItemCanBeRentedInDates(int ItemId, int CustomerId, Date RentFrom, Date RentTo) {
        boolean isCanBeRented = false;

        try{
            isCanBeRented = ((this.getCrudeItemRents(ItemId, CustomerId, RentFrom, RentTo)).size() == 0);
        }catch (Exception e){
            e.printStackTrace();
        }

        return isCanBeRented;
    }

    /**
     *
     * @param BuyerId
     * @return
     */
    @Override
    public List<Object> getBuyerRents(int BuyerId, int PageNum, int ResultsPerPage) {
        List<Object> rents = null;

        try{
        	
        	Query query = this.createQueryRentCount(PageNum, ResultsPerPage, "BUYERID = :buyerId")
					.setParameter("buyerId", BuyerId);
        	
            rents = this.createListOutOfQueryForCustomer(query, BuyerId);
        }catch (Exception e) {
            e.printStackTrace();
        }

        return rents;
    }

    /**
     *
     * @param BuyerId
     * @param StatusId
     * @return
     */
    @Override
    public List<Object> getBuyerRents(int BuyerId, int StatusId, int PageNum, int ResultsPerPage){
        List<Object> rents = null;

        try{
        	Query query = this.createQueryRentCount(PageNum, ResultsPerPage, "BUYERID = :buyerId AND STATUSID = :statusId")
					.setParameter("buyerId", BuyerId)
					.setParameter("statusId", StatusId);
        	
            rents = this.createListOutOfQueryForCustomer(query, BuyerId);

        }catch (Exception e) {
            e.printStackTrace();
        }

        return rents;
    }

    /**
     *
     * @param SupplierId
     * @return
     */
    @Override
    public List<Object> getSupplierRents(int SupplierId, int PageNum, int ResultsPerPage) {
        List<Object> rents = null;

        try{
        	Query query = this.createQueryRentCount(PageNum, ResultsPerPage, "SUPPLIERID = :supplierId")
        			.setParameter("supplierId", SupplierId);
        	
            rents = this.createListOutOfQueryForCustomer(query, SupplierId);
            
        }catch (Exception e) {
            e.printStackTrace();
        }

        return rents;
    }

    /**
     *
     * @param SupplierId
     * @param StatusId
     * @return
     */
    @Override
    public List<Object> getSupplierRents(int SupplierId, int StatusId, int PageNum, int ResultsPerPage){
        List<Object> rents = null;

        try{
        	Query query = this.createQueryRentCount(PageNum, ResultsPerPage, "SUPPLIERID = :supplierId AND STATUSID = :statusId")
					.setParameter("supplierId", SupplierId)
					.setParameter("statusId", StatusId);
        	
            rents = this.createListOutOfQueryForCustomer(query, SupplierId);

        }catch (Exception e) {
            e.printStackTrace();
        }

        return rents;
    }

    /**
     *
     * @param ItemId
     * @return
     */
    @Override
    public List<Object> getItemRents(int ItemId, int CustomerId, int PageNum, int ResultsPerPage) {
    	List<Object> rents = null;

        if (this.findItemOwner(ItemId) == CustomerId){
	        try{
	        	Query query = this.createQueryRentCount(PageNum, ResultsPerPage, "ITEMID = :itemId");

	            rents = this.createListOutOfQueryForItem(query, ItemId, CustomerId);
	        }catch (Exception e) {
	            e.printStackTrace();
	        }
        }

        return rents;
    }

    /**
     *
     * @param ItemId
     * @param StatusId
     * @return
     */
    @Override
    public List<Object> getItemRents(int ItemId, int CustomerId, int StatusId, int PageNum, int ResultsPerPage){
    	List<Object> rents = null;

        if (this.findItemOwner(ItemId) == CustomerId){
	        try{
	            Query query = this.createQueryRentCount(PageNum, ResultsPerPage, "ITEMID = :itemId AND STATUSID = :statusId")
	            															.setParameter("statusId", StatusId);

	            rents = this.createListOutOfQueryForItem(query, ItemId, CustomerId);
	
	        }catch (Exception e) {
	            e.printStackTrace();
	        }
        }

        return rents;
    }

    /**
     *
     * @param ItemId
     * @param startDate
     * @param endDate
     * @return
     */
    @Override
    public List<Object> getItemRents(int ItemId, int CustomerId,
                                                Date startDate, Date endDate,
                                                int PageNum, int ResultsPerPage) { 
    	List<Object> rents = null;

        if (this.findItemOwner(ItemId) == CustomerId){
	        try{
	            Query query = this.createQueryRentCount(PageNum, ResultsPerPage, "ITEMID = :itemId AND RENTTODATE >= :startDate AND RENTFROMDATE <= :endDate")
	            															.setParameter("startDate", startDate)
        																	.setParameter("endDate", endDate);

	            rents = this.createListOutOfQueryForItem(query, ItemId, CustomerId);
	
	        }catch (Exception e) {
	            e.printStackTrace();
	        }
        }   	

        return rents;
    }

    /**
     *
     * @param BuyerId
     * @return
     */
    @Override
    public List<FeedbackBuyerBean> getBuyerFeedback(int BuyerId, int PageNum, int ResultsAmount) {
        List<FeedbackBuyerBean> lstFeedback = null;

        try{
            @SuppressWarnings("unchecked")
			List<Object[]> lstEntity = this.createQueryRentFeedback("BUYERID = :buyerId AND BuyerRate IS NOT NULL AND SupplierRate IS NOT NULL",
            								PageNum, ResultsAmount)
                    .setParameter("buyerId", BuyerId)
                    .getResultList();

            lstFeedback = new ArrayList<FeedbackBuyerBean>();
            for (Object[] obj : lstEntity){
                lstFeedback.add(new FeedbackBuyerBean((RentEntity) obj[0], (FeedbackEntity) obj[1]));
            }

        }catch (Exception e) {
            e.printStackTrace();
        }

        return lstFeedback;
    }

    /**
     *
     * @param SupplierId
     * @return
     */
    @Override
    public List<FeedbackSupplierBean> getSupplierFeedback(int SupplierId, int PageNum, int ResultsAmount) {
        List<FeedbackSupplierBean> lstFeedback = null;

        try{
            @SuppressWarnings("unchecked")
			List<Object[]> lstEntity = this.createQueryRentFeedback("SUPPLIERID = :supplierId AND SupplierRate IS NOT NULL AND BuyerRate IS NOT NULL",
											PageNum, ResultsAmount)
            		.setParameter("supplierId", SupplierId)
                    .getResultList();

            lstFeedback = new ArrayList<FeedbackSupplierBean>();
            for (Object[] obj : lstEntity){
                lstFeedback.add(new FeedbackSupplierBean((RentEntity) obj[0], (FeedbackEntity) obj[1]));
            }

        }catch (Exception e) {
            e.printStackTrace();
        }

        return lstFeedback;
    }

    /**
     *
     * @param ItemId
     * @return
     */
    @Override
    public List<FeedbackItemBean> getItemFeedback(int ItemId, int PageNum, int ResultsAmount) {
        List<FeedbackItemBean> lstFeedback = null;

        try{
            @SuppressWarnings("unchecked")
			List<Object[]> lstEntity = this.createQueryRentFeedback("ITEMID = :itemId AND ItemRate IS NOT NULL AND BuyerRate IS NOT NULL",
											PageNum, ResultsAmount)
                    .setParameter("itemId", ItemId)
                    .getResultList();

            lstFeedback = new ArrayList<FeedbackItemBean>();
            for (Object[] obj : lstEntity){
                lstFeedback.add(new FeedbackItemBean((RentEntity) obj[0], (FeedbackEntity) obj[1]));
            }

        }catch (Exception e) {
            e.printStackTrace();
        }

        return lstFeedback;
    }

    /**
     *
     * @param ItemId
     * @param startDate
     * @param endDate
     * @param DF
     * @return
     */
    @Override
    public List<RentScheduleBean> getItemRentsSchedule(int ItemId, Date startDate, Date endDate, DateFormat DF) {
        List<RentEntity> rents = this.getCrudeItemRents(ItemId, startDate, endDate);
        List<RentScheduleBean> rentsSchedule = null;

        if (rents != null){
            rentsSchedule = new ArrayList<RentScheduleBean>();

            for (RentEntity rent : rents){
                rentsSchedule.add(new RentScheduleBean(rent));
            }
        }

        return rentsSchedule;
    }

    /**
     *
     * @param BuyerId
     * @return
     */
    @Override
    public List<RentListSuperBean> getNeededBuyerRateRent(int BuyerId){
        List<RentListSuperBean> rents = null;

        try{
            List<RentEntity> lstEntity = manager
                    .createNamedQuery("Feedback.OpenedForBuyerRate", RentEntity.class)
                    .getResultList();

            rents = new ArrayList<RentListSuperBean>();
            for (RentEntity rent : lstEntity){
                rents.add(this.convertListEntity(rent, BuyerId));
            }

        }catch (Exception e) {
            e.printStackTrace();
        }

        return rents;
    }

    /**
     *
     * @param SupplierId
     * @return
     */
    @Override
    public List<RentListSuperBean> getNeededSupplierOrItemRateRent(int SupplierId){
        List<RentListSuperBean> rents = null;

        try{
            List<RentEntity> lstEntity = manager
                    .createNamedQuery("Feedback.OpenedForSupplierOrItemRate", RentEntity.class)
                    .getResultList();

            rents = new ArrayList<RentListSuperBean>();
            for (RentEntity rent : lstEntity){
                rents.add(this.convertListEntity(rent, SupplierId));
            }

        }catch (Exception e) {
            e.printStackTrace();
        }

        return rents;
    }

    /**
     * @param CustomerId
     * @param FromTime
     * @return
     */
    @Override
    public long getCustomerSumRentNotificationsCount(int CustomerId){
        int messagesCount = 0;

        try{
            StringBuilder queryString = new StringBuilder();

            queryString.insert(0, "SELECT COUNT(r.id) ")
                    .append("FROM Rent r ")
                    .append("WHERE ")
                    .append("(r.BuyerId = :buyerId AND r.IsNewBuyer = TRUE) ")
                    .append("OR ")
                    .append("(r.SupplierId = :supplierId AND r.IsNewSupplier = TRUE) ");

            messagesCount = ((Number) manager.createNativeQuery(queryString.toString())
                    .setParameter("buyerId", CustomerId)
                    .setParameter("supplierId", CustomerId)
                    .getSingleResult()).intValue();

        }catch (Exception e) {
            e.printStackTrace();
        }

        return messagesCount;
    }

    /**
     * 
     */
	@Override
	public RentDetailsSuperBean populateRentDetails(int CustomerId, int RentId) {
		RentEntity rent = this.getRentById(RentId);
		
		RentDetailsSuperBean rentBean = null;
		
		if (rent != null){
			
            if (CustomerId == rent.getThisBuyer().getId()){
                rent.setIsNewBuyer(false);
            }
            else if (CustomerId == rent.getThisSupplier().getId()){
                rent.setIsNewSupplier(false);
            }

            manager.merge(rent);
            
			rentBean = this.convertDetailedEntity(rent, CustomerId);
		}
		
		return rentBean;
	}

    /**
     *
     * @param RentId
     * @return
     */
    private RentEntity getRentById(int RentId){
        RentEntity thisRent = null;

        try{
            thisRent = manager.find(RentEntity.class, RentId);
        }catch (Exception e) {
            e.printStackTrace();
        }

        return thisRent;
    }

    /**
     *
     * @param ItemId
     * @param startDate
     * @param endDate
     * @return
     */
    private List<RentEntity> getCrudeItemRents(int ItemId, int CustomerId, Date startDate, Date endDate) {
        List<RentEntity> rents = null;

        try{
            List<Integer> includeStatusList = new ArrayList<Integer>(){/**
				 * 
				 */
				private static final long serialVersionUID = 1243574324374578451L;

			{
                add(ApplicationConstants.RentStatus.Approved.ordinal());
                add(ApplicationConstants.RentStatus.InRent.ordinal());
            }};

            manager.unwrap(Session.class).enableFilter("betweenDates")
                    .setParameter("startDate", startDate)
                    .setParameter("endDate", endDate);
            manager.unwrap(Session.class).enableFilter("item").setParameter("itemId", ItemId);
            manager.unwrap(Session.class).enableFilter("notBuyer").setParameter("buyer", CustomerId);
            manager.unwrap(Session.class).enableFilter("includedStatusList")
                    .setParameterList("statusList", includeStatusList);

            rents = manager
                    .createNamedQuery("Rent.DateOpenedDesc", RentEntity.class)
                    .getResultList();

            manager.unwrap(Session.class).disableFilter("betweenDates");
            manager.unwrap(Session.class).disableFilter("item");
            manager.unwrap(Session.class).disableFilter("notBuyer");
            manager.unwrap(Session.class).disableFilter("includedStatusList");

        }catch (Exception e) {
            e.printStackTrace();
        }

        return rents;
    }

    /**
     *
     * @param ItemId
     * @param startDate
     * @param endDate
     * @return
     */
    private List<RentEntity> getCrudeItemRents(int ItemId, Date startDate, Date endDate) {
        List<RentEntity> rents = null;

        try{
            List<Integer> includeStatusList = new ArrayList<Integer>(){/**
				 * 
				 */
				private static final long serialVersionUID = -8677142968825614621L;

			{
                add(ApplicationConstants.RentStatus.Approved.ordinal());
                add(ApplicationConstants.RentStatus.InRent.ordinal());
                add(ApplicationConstants.RentStatus.Ended.ordinal());
            }};

            manager.unwrap(Session.class).enableFilter("betweenDates")
                    .setParameter("startDate", startDate)
                    .setParameter("endDate", endDate);
            manager.unwrap(Session.class).enableFilter("item").setParameter("itemId", ItemId);
            manager.unwrap(Session.class).enableFilter("includedStatusList")
                    .setParameterList("statusList", includeStatusList);

            rents = manager
                    .createNamedQuery("Rent.DateOpenedDesc", RentEntity.class)
                    .getResultList();

            manager.unwrap(Session.class).disableFilter("betweenDates");
            manager.unwrap(Session.class).disableFilter("item");
            manager.unwrap(Session.class).disableFilter("includedStatusList");

        }catch (Exception e) {
            e.printStackTrace();
        }

        return rents;
    }

    /**
     * @param AdditionalFromClause
     * @return
     */
    private Query createQueryRentCount(int PageNum, int ResultsPerPage, String AdditionalFromClause){
        Query query = null;
        try {
            String selectClause = "SELECT r.* ";
            String selectClauseCount = "SELECT COUNT(1) ";
            
            String fromClause = "FROM Rent r ";
            

            StringBuilder whereClause = new StringBuilder();
            whereClause.insert(0, "WHERE ").append(AdditionalFromClause).append(" ");

            String orderByClause = "ORDER BY r.DateUpdated DESC ";

            
            int skipRecords = (PageNum - 1) * ResultsPerPage;
            StringBuilder limitBuilder = new StringBuilder();
            String limitClause = limitBuilder
                    .insert(0,"LIMIT ")
                    .append(ResultsPerPage)
                    .append(" OFFSET ")
                    .append(skipRecords).toString();

            StringBuilder wrappedPaginationCountSection = new StringBuilder();
            wrappedPaginationCountSection.insert(0, "(" + selectClauseCount)
            							 .append(fromClause.toString())
            							 .append(whereClause.toString())
            							 .append(") AS ROW_COUNT ");
            
            StringBuilder wrappedPagination = new StringBuilder();
            wrappedPagination.insert(0, selectClause)
							 .append(", " + wrappedPaginationCountSection)
							 .append(fromClause.toString())
							 .append(whereClause.toString())
							 .append(orderByClause)
            				 .append(limitClause);

            query = manager.createNativeQuery(wrappedPagination.toString(), "rows.And.CountRows");
        }catch (Exception e){
            e.printStackTrace();
        }

        return query;
    }

    /**
     * @param AdditionalFromClause
     * @return
     */
    private Query createQueryRentFeedback(String AdditionalFromClause, int PageNum, int ResultsAmount){
        Query query = null;
        try {
            String selectClause = "SELECT r.*, f.* ";
            String fromClause = "FROM Rent r, Feedback f ";

            StringBuilder whereClause = new StringBuilder();
            whereClause.insert(0, "WHERE r.FeedbackId = f.id ").append("AND ").append(AdditionalFromClause).append(" ");

            String orderByClause = "ORDER BY r.DateUpdated ";
            
            int skipRecords = (PageNum - 1) * ResultsAmount;
            StringBuilder limitBuilder = new StringBuilder();
            String limitClause = limitBuilder
                    .insert(0,"LIMIT ")
                    .append(ResultsAmount)
                    .append(" OFFSET ")
                    .append(skipRecords).toString();

            StringBuilder wrappedPagination = new StringBuilder();
            wrappedPagination
            	.insert(0, selectClause)
            	.append(fromClause)
            	.append(whereClause.toString())
            	.append(orderByClause)
            	.append(limitClause);;

            query = manager.createNativeQuery(wrappedPagination.toString(), "Feedback.Rent.Returned");
        }catch (Exception e){
            e.printStackTrace();
        }

        return query;
    }
    
    /**
     * 
     * @param RentDetails
     * @return
     */
    @SuppressWarnings("unchecked")
	private boolean sendRentJson(RentDetailsSuperBean RentDetails){
    	boolean isSent = false;
        
        try{
            String rentJSON = new Gson().toJson(RentDetails);
            
            for (javax.websocket.Session s : WebSocket.connectedUsers.keySet()){
            	if (WebSocket.connectedUsers.get(s) != null &&
            			WebSocket.connectedUsers.get(s) == RentDetails.getOtherId()){		
                    JSONObject main = new JSONObject();
                    main.put("event", "rent");
                	main.put("data", rentJSON);
                	
                    StringWriter out = new StringWriter();
                    
                	main.writeJSONString(out);
                	
            		s.getAsyncRemote().sendText(out.toString());
            	}
            }
            
            isSent = true;
        } catch(Exception e){
        	e.printStackTrace();
        }
        
        return isSent;
    }

    /**
     *
     * @param Rent
     * @return
     */
    private int findItemOwner(int ItemId){
        ItemEntity item = manager.find(ItemEntity.class,  ItemId);
        int ownerId = -1;
        
        if (item != null){
        	ownerId = item.getThisCustomer().getId();
        }
        
        return ownerId;
    }
    
    /**
     * 
     * @param query
     * @param CustomerId
     * @return
     */
    public List<Object> createListOutOfQueryForCustomer(Query query, int CustomerId){
    	List<Object> lstResult = null;
    	try{
    		@SuppressWarnings("unchecked")
			List<Object[]> lstRentsWithCount = query.getResultList();
			
			lstResult =  this.makeRentsResultListForCustomer(lstRentsWithCount, CustomerId);
    	} catch(Exception e){
    		e.printStackTrace();
    	}
    	
    	return lstResult;
    }
    
    /**
     * 
     * @param query
     * @param CustomerId
     * @return
     */
    public List<Object> createListOutOfQueryForItem(Query query, int ItemId, int CustomerId){
    	List<Object> lstResult = null;
    	try{
    		@SuppressWarnings("unchecked")
			List<Object[]> lstRentsWithCount = query
    				.setParameter("itemId", ItemId)
    				.getResultList();
			
			lstResult =  this.makeRentsResultListForItem(lstRentsWithCount, ItemId, CustomerId);
    	} catch(Exception e){
    		e.printStackTrace();
    	}
    	
    	return lstResult;
    }

    /**
     *
     * @param LstRents
     * @return
     */
    private List<Object> makeRentsResultListForCustomer(List<Object[]> LstRents, int CustomerId){
    	List<Object> lstResult = null;

        if (LstRents != null) {
            try{
                List<RentListSuperBean> lstPureRents = new ArrayList<RentListSuperBean>();
                lstResult = new ArrayList<Object>();

                if (LstRents.size() > 0){
                    RentEntity rent; 
                    
                    for (Object[] rentWithCount : LstRents){
                    	rent = (RentEntity) rentWithCount[0];
                    	
                    	if (CustomerId == rent.getThisBuyer().getId() ||
                    			CustomerId == rent.getThisSupplier().getId()){
                    		lstPureRents.add(new RentListSelfBean(rent, CustomerId));
                    	}
                    }
                    
                    BigInteger totalSize = (BigInteger)LstRents.get(0)[1];
                    lstResult.add(totalSize);
                }
                else{
                    lstResult.add(0);
                }
                
                lstResult.add(lstPureRents);
            }catch(Exception e){
                e.printStackTrace();
            }
        }

        return lstResult;
    }

    /**
     *
     * @param LstRents
     * @return
     */
    private List<Object> makeRentsResultListForItem(List<Object[]> LstRents, int ItemId, int CustomerId){
    	List<Object> lstResult = null;

        if (LstRents != null) {
            try{
                List<RentListSuperBean> lstPureRents = new ArrayList<RentListSuperBean>();
                lstResult = new ArrayList<Object>();

                if (LstRents.size() > 0){
                    RentEntity rent; 
                    
                    for (Object[] rentWithCount : LstRents){
                    	rent = (RentEntity) rentWithCount[0];
                    	
                    	if (CustomerId == rent.getThisBuyer().getId() ||
                    			CustomerId == rent.getThisSupplier().getId()){
                    		lstPureRents.add(new RentListSelfBean(rent, CustomerId));
                    	}
                    }
                    
                    BigInteger totalSize = (BigInteger)LstRents.get(0)[1];
                    lstResult.add(totalSize);
                }
                else{
                    lstResult.add(0);
                }
                
                MinimumItemDetailsBean minimumDetails = new MinimumItemDetailsBean(manager.find(ItemEntity.class, ItemId));
                lstResult.add(minimumDetails);
                
                lstResult.add(lstPureRents);
            }catch(Exception e){
                e.printStackTrace();
            }
        }

        return lstResult;
    }

    /**
     *
     * @param Rent
     * @return
     */
    private RentListSuperBean convertListEntity(RentEntity Rent, int OwnerId){
        RentListSuperBean rent = null;

        try{
        	if (OwnerId == Rent.getThisBuyer().getId() ||
        			OwnerId == Rent.getThisSupplier().getId()){
        		rent = new RentListSelfBean(Rent, OwnerId);
        	}
        }catch(Exception e){
            e.printStackTrace();
        }

        return rent;
    }

    /**
     *
     * @param Rent
     * @return
     */
    private RentDetailsSuperBean convertDetailedEntity(RentEntity Rent, int CustomerId){
        RentDetailsSuperBean rent = null;

        try{
        	if (CustomerId == Rent.getThisBuyer().getId() ||
        			CustomerId == Rent.getThisSupplier().getId()){
        		rent = new RentDetailsSelfBean(Rent, CustomerId);
        	}
        }catch(Exception e){
            e.printStackTrace();
        }

        return rent;
    }
}
