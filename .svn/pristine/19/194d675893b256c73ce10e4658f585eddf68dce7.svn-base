package daoBeans;

import application.ApplicationConstants;
import application.Location;
import dao.ItemDAO;
import exportBeans.Abstract.ItemDetailsSuperBean;
import exportBeans.Abstract.ItemListSuperBean;
import exportBeans.FeedbackItemBean;
import exportBeans.Public.ItemDetailsPublicBean;
import exportBeans.Public.ItemListPublicBean;
import exportBeans.RentScheduleBean;
import exportBeans.Self.ItemDetailsSelfBean;
import exportBeans.Self.ItemListSelfBean;
import entities.*;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.util.Base64;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.io.*;
import java.math.BigInteger;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 25/10/14
 * Time: 20:15
 * To change this template use File | Settings | File Templates.
 */
@Stateless
public class ItemDAOBean implements ItemDAO{

    final int IMG_WIDTH = 500;
    final int IMG_HEIGHT = 500;

    @PersistenceContext(unitName="WhyBuyPersistenceUnit")
    private EntityManager manager;

    public ItemDAOBean() {
//        logger = Logger.getLogger(this.getClass().getName());
//        try {
//            fileHandler = new FileHandler("C:/uRent/log/" + this.getClass().getName() + ".log");
//        } catch (IOException e) {
//            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
//        }
//        xmlFormatter = new XMLFormatter();
//
//        logger.addHandler(fileHandler);
//        fileHandler.setFormatter(xmlFormatter);
    }

    @Override
    public boolean addItem(int CustomerId, String ItemName, String Description,
                           int CategoryId, Float DailyPrice,
                           Float WeeklyPrice, Float MonthlyPrice, Float Value,
                           HashMap<String, String> lstItemPhotoIds) {
        boolean isAddedSuccessful = false;

        try {

            PriceEmbeddable price = new PriceEmbeddable(DailyPrice, WeeklyPrice, MonthlyPrice, Value);

            ItemEntity item = new ItemEntity(manager.find(CustomerEntity.class, CustomerId),
                                             ItemName, Description,
                                             manager.find(CategoryEntity.class, CategoryId),
                                             price);

            manager.persist(item);

            int ItemId = item.getId();

            if (lstItemPhotoIds != null) {
                ItemPhotoEntity currItemPhoto;
                for (String ItemPhotoId : lstItemPhotoIds.keySet()){
                    if ((currItemPhoto = manager.find(ItemPhotoEntity.class, Integer.parseInt(ItemPhotoId))) != null) {
                        if (Boolean.parseBoolean(lstItemPhotoIds.get(ItemPhotoId))){
                            currItemPhoto.setItemId(ItemId);

                            manager.merge(currItemPhoto);
                        }
                        else{
                            manager.remove(currItemPhoto);
                        }
                    }
                }
            }

            isAddedSuccessful = true;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return isAddedSuccessful;
    }

    /**
     *
     * @param CustomerId
     * @param ItemId
     * @param inputPart
     * @return
     */
    @Override
    public int addItemPhoto(int CustomerId, Integer ItemId, InputPart inputPart) {
        int itemPhotoId = 0;

        try {
            InputStream inputStream = inputPart.getBody(InputStream.class,null);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            int reads = inputStream.read();
            while(reads != -1) {
                outputStream.write(reads);
                reads = inputStream.read();
            }

            String base64String = Base64.encodeBytes(outputStream.toByteArray());
            outputStream.close();

            ItemPhotoEntity itemPhoto = new ItemPhotoEntity(ItemId, base64String);

            manager.persist(itemPhoto);

            itemPhotoId = itemPhoto.getId();

        } catch (IOException e) {
            e.printStackTrace();
        }

        return itemPhotoId;
    }

    /**
     *
     * @param ItemId
     * @param ItemName
     * @param Description
     * @param CategoryId
     * @return
     */
    @Override
    public boolean updateItem(int ItemId, String ItemName, String Description,
                              int CategoryId, boolean Availability,
                              Float DailyPrice, Float WeeklyPrice, Float MonthlyPrice, Float Value,
                              HashMap<String, String> lstItemPhotoIds) {

        boolean isItemUpdated = false;

        ItemEntity item;

        if ((item = this.getItemById(ItemId)) != null){

            try {
                item.setItemName(ItemName);
                item.setDescription(Description);
                item.setThisCategory(manager.find(CategoryEntity.class, CategoryId));
                item.setAvailability(Availability);
                item.setThisPrice(new PriceEmbeddable(DailyPrice, WeeklyPrice, MonthlyPrice, Value));

                manager.merge(item);

                if (lstItemPhotoIds != null) {
                    ItemPhotoEntity currItemPhoto;
                    for (String ItemPhotoId : lstItemPhotoIds.keySet()){
                        if ((currItemPhoto = manager.find(ItemPhotoEntity.class, Integer.parseInt(ItemPhotoId))) != null) {
                            if (Boolean.parseBoolean(lstItemPhotoIds.get(ItemPhotoId))){
                                currItemPhoto.setItemId(ItemId);

                                manager.merge(currItemPhoto);
                            }
                            else{
                                manager.remove(currItemPhoto);
                            }
                        }
                    }
                }

                isItemUpdated = true;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return isItemUpdated;
    }

    /**
     *
     * @param ItemId
     * @return
     */
    @Override
    public boolean deleteItem(int ItemId, int customerID) {
        boolean isItemDeleted = false;

        ItemEntity item;

        if ((item = this.getItemById(ItemId)) != null) {
            List<ItemPhotoEntity> lstItemPhotos = this.getPhotosOfItem(ItemId);

            if (customerID == item.getThisCustomer().getId()) {
                try {
                    for (ItemPhotoEntity itemPhotoEntity : lstItemPhotos){
                        manager.remove(itemPhotoEntity);
                    }

                    manager.remove(item);

                    isItemDeleted = true;
                } catch (HibernateException e) {
                    e.printStackTrace();
                }
            }
        }

        return isItemDeleted;
    }

    /**
     *
     * @param ItemPhotoId
     * @return
     */
    @Override
    public boolean deleteItemPhoto(int ItemPhotoId) {
        boolean isItemPhotoDeleted = false;

        ItemPhotoEntity itemPhoto;

        if ((itemPhoto = this.getItemPhotoById(ItemPhotoId)) != null) {
            try {
                manager.remove(itemPhoto);

                isItemPhotoDeleted = true;
            } catch (HibernateException e) {

                e.printStackTrace();
            }
        }

        return isItemPhotoDeleted;
    }

    /**
     *
     * @param ItemId
     * @return
     */
    @Override
    public ItemEntity getItemById(int ItemId){
        ItemEntity thisItem = null;

        try{
            thisItem = manager.find(ItemEntity.class, ItemId);
        }catch (Exception e) {
            e.printStackTrace();
        }

        return thisItem;
    }

    /**
     *
     * @param ItemPhotoId
     * @return
     */
    @Override
    public ItemPhotoEntity getItemPhotoById(int ItemPhotoId) {
        ItemPhotoEntity thisItemPhoto = null;

        try{
            thisItemPhoto = manager.find(ItemPhotoEntity.class, ItemPhotoId);
        }catch (Exception e) {
            e.printStackTrace();
        }

        return thisItemPhoto;
    }

    /**
     *
     * @param SearchExpression
     * @param PageNum
     * @param ResultsAmount
     * @param CustomerId
     * @param Order
     * @param searchParameters
     * @return
     */
    @Override
    public List<Object> getItemsByBestMatch(String SearchParameters, int PageNum, int ResultsAmount,
                                                          int CustomerId, ApplicationConstants.OrderByOrder Order) {
        List<Object> lstNarrowItems = null;

        try{
        	int expIndex;
            if ((expIndex = SearchParameters.indexOf("q=")) > -1){
            	
            	Query query = this.createQueryFromItemOnly(SearchParameters, PageNum, ResultsAmount,
	                       "levenshtein_String_Distance(i.ItemName, :searchedExpressionOrder)",
	                       Order);
                
                String expression = null;
                if (SearchParameters.indexOf("&", expIndex) > -1) {
                    expression = SearchParameters.substring(
							expIndex + 2,
							SearchParameters.indexOf("&", expIndex));
                } else {
                    expression = SearchParameters.substring(expIndex + 2);
                }

                lstNarrowItems = this.createListOutOfQuery(query.setParameter("searchedExpressionOrder", expression), CustomerId);
            }
        }catch (Exception e) {
            e.printStackTrace();
        }

        return lstNarrowItems;

    }

    /**
     *
     * @param SearchExpression
     * @param PageNum
     * @param ResultsAmount
     * @param CustomerId
     * @param Order
     * @param searchParameters
     * @return
     */
    @Override
    public List<Object> getItemsByDistance(String SearchParameters, int PageNum, int ResultsAmount,
            											int CustomerId, ApplicationConstants.OrderByOrder Order) {
        List<Object> lstNarrowItems = null;

        try{
        	
        	String fromCluase = "From Item i ";
        	if (!SearchParameters.contains("maxDistance")) {
        		fromCluase = fromCluase + ", Customer c ";
        	}
        	
        	Query query = this.createQuery(SearchParameters, PageNum, ResultsAmount,
        			fromCluase,
                    "haversine_Points_Distance(c.PosLatitude, c.PosLongitude, :latitude, :longitude, :units)",
                    Order);
            
            CustomerEntity customer = (CustomerId > ApplicationConstants.DEFAULT_CUSTOMER_ID ?
                                             manager.find(CustomerEntity.class, CustomerId) :
                                             null);
            
            if (customer != null){
            	query = query
                        .setParameter("latitude", customer.getPoslatitude())
                        .setParameter("longitude", customer.getPoslongitude())
                        .setParameter("units", ApplicationConstants.DEFAULT_UNITS); //TODO: units
            }
            
            @SuppressWarnings("unchecked")
			List<Object[]> lstItemsWithCount = query.getResultList();

            lstNarrowItems = this.makeItemResultList(lstItemsWithCount, customer);
        }catch (Exception e) {
            e.printStackTrace();
        }

        return lstNarrowItems;
    }

    /**
     *
     * @param PageNum
     * @param ResultsAmount
     * @return
     */
    @Override
    public List<Object> getItemsByRentCount(String SearchParameters, int PageNum, int ResultsAmount,
														int CustomerId, ApplicationConstants.OrderByOrder Order) {
        List<Object> lstNarrowItems = null;

        try{
        	Query query = this.createQueryFromItemOnly(SearchParameters, PageNum, ResultsAmount,
                	"i.RentCount",
                	Order);

        	lstNarrowItems = this.createListOutOfQuery(query, CustomerId);
        }catch (Exception e) {
            e.printStackTrace();
        }

        return lstNarrowItems;
    }

    /**
     *
     * @param PageNum
     * @param ResultsAmount
     * @return
     */
    @Override
    public List<Object> getItemsByDatePublished(String SearchParameters, int PageNum, int ResultsAmount,
															int CustomerId, ApplicationConstants.OrderByOrder Order) {
        List<Object> lstNarrowItems = null;

        try{
        	Query query = this.createQueryFromItemOnly(SearchParameters, PageNum, ResultsAmount,
                    "i.DatePublished",
                	Order);

        	lstNarrowItems = this.createListOutOfQuery(query, CustomerId);
        }catch (Exception e) {
            e.printStackTrace();
        }

        return lstNarrowItems;
    }

    /**
     *
     * @param PageNum
     * @param ResultsAmount
     * @return
     */
    @Override
    public List<Object> getItemsByDailyPrice(String SearchParameters, int PageNum, int ResultsAmount,
															int CustomerId, ApplicationConstants.OrderByOrder Order) {
		List<Object> lstNarrowItems = null;
			
		try{
        	Query query = this.createQueryFromItemOnly(SearchParameters, PageNum, ResultsAmount,
					"i.DailyPrice",
					Order);

        	lstNarrowItems = this.createListOutOfQuery(query, CustomerId);
        }catch (Exception e) {
            e.printStackTrace();
        }

        return lstNarrowItems;
    }

    /**
     *
     * @param PageNum
     * @param ResultsAmount
     * @return
     */
    @Override
    public List<Object> getItemsByWeeklyPrice(String SearchParameters, int PageNum, int ResultsAmount,
															int CustomerId, ApplicationConstants.OrderByOrder Order) {
        List<Object> lstNarrowItems = null;

        try{
        	Query query = this.createQueryFromItemOnly(SearchParameters, PageNum, ResultsAmount,
					"i.WeeklyPrice",
					Order);

        	lstNarrowItems = this.createListOutOfQuery(query, CustomerId);
        }catch (Exception e) {
            e.printStackTrace();
        }

        return lstNarrowItems;
    }

    /**
     *
     * @param PageNum
     * @param ResultsAmount
     * @return
     */
    @Override
    public List<Object> getItemsByMonthlyPrice(String SearchParameters, int PageNum, int ResultsAmount,
															int CustomerId, ApplicationConstants.OrderByOrder Order) {
        List<Object> lstNarrowItems = null;

        try{
        	Query query = this.createQueryFromItemOnly(SearchParameters, PageNum, ResultsAmount,
					"i.MonthlyPrice",
					Order);

        	lstNarrowItems = this.createListOutOfQuery(query, CustomerId);
        }catch (Exception e) {
            e.printStackTrace();
        }

        return lstNarrowItems;
    }

    /**
     *
     * @param PageNum
     * @param ResultsAmount
     * @return
     */
    @Override
    public List<Object> getItemsByValue(String SearchParameters, int PageNum, int ResultsAmount,
														int CustomerId, ApplicationConstants.OrderByOrder Order) {
        List<Object> lstNarrowItems = null;

        try{
        	Query query = this.createQueryFromItemOnly(SearchParameters, PageNum, ResultsAmount,
					"i.Value",
					Order);

        	lstNarrowItems = this.createListOutOfQuery(query, CustomerId);
        }catch (Exception e) {
            e.printStackTrace();
        }

        return lstNarrowItems;
    }

    /**
     *
     * @param PageNum
     * @param ResultsAmount
     * @return
     */
    @Override
    public List<Object> getItemsByRate(String SearchParameters, int PageNum, int ResultsAmount,
													int CustomerId, ApplicationConstants.OrderByOrder Order) {
        List<Object> lstNarrowItems = null;

        try{
        	Query query = this.createQueryFromItemOnly(SearchParameters, PageNum, ResultsAmount,
					"i.Rate",
					Order);

        	lstNarrowItems = this.createListOutOfQuery(query, CustomerId);
        }catch (Exception e) {
            e.printStackTrace();
        }

        return lstNarrowItems;
    }

    /**
     *
     * @param ItemId
     * @return
     */
    @Override
    public List<ItemPhotoEntity> getPhotosOfItem(int ItemId) {
        List<ItemPhotoEntity> lstItemPhotos = new ArrayList<ItemPhotoEntity>();

        try{
            manager.unwrap(Session.class).enableFilter("item").setParameter("itemId", ItemId);

            lstItemPhotos = manager
                    .createNamedQuery("ItemPhoto.ID", ItemPhotoEntity.class)
                    .getResultList();

        }catch (Exception e) {
            e.printStackTrace();
        }

        return lstItemPhotos;
    }

    /**
     *
     * @param ItemId
     * @return
     */
    @Override
    public ItemDetailsSuperBean populateFullItemDetails(int ItemId, int CustomerId,
                                                      List<FeedbackItemBean> Feedback,
                                                      List<RentScheduleBean> Rents){
        ItemDetailsSuperBean itemDetails = null;
        CustomerEntity currCustomer;
        Location location = null;

        if ((currCustomer = manager.find(CustomerEntity.class, CustomerId)) != null){
            location = new Location(currCustomer.getPoslatitude(), currCustomer.getPoslongitude());
        }

        try {
            ItemEntity itemEntity;

            if ((itemEntity = this.getItemById(ItemId)) != null) {

                List<ItemPhotoEntity> lstItemPhotos = this.getPhotosOfItem(itemEntity.getId());

                CategoryEntity category = itemEntity.getThisCategory();
                CategoryEntity parentCategory = null;
                if (category.getParentId() != null) {
                    parentCategory = manager.find(CategoryEntity.class, category.getParentId());
                }

                if (CustomerId == itemEntity.getThisCustomer().getId()){
                    itemDetails = new ItemDetailsSelfBean(itemEntity, lstItemPhotos, Feedback,
                            Rents, category, parentCategory);
                }
                else{
                    itemDetails = new ItemDetailsPublicBean(location, itemEntity, lstItemPhotos, Feedback,
                            Rents, category, parentCategory);
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        return itemDetails;
    }

    /**
     *
     * @param ItemId
     * @return
     */
    private ItemPhotoEntity getMainPhotoOfItem(int ItemId) {
        ItemPhotoEntity mainPhoto = null;

        try{
            manager.unwrap(Session.class).enableFilter("item").setParameter("itemId", ItemId);

            List<ItemPhotoEntity> mainPhotoLst = manager
                    .createNamedQuery("ItemPhoto.ID", ItemPhotoEntity.class)
                    .setMaxResults(1)
                    .getResultList();

            if (mainPhotoLst != null && mainPhotoLst.size() > 0) {
                mainPhoto = mainPhotoLst.get(0);
            }
        }catch (Exception e) {
            e.printStackTrace();
        }

        return mainPhoto;
    }
    
    /**
     * 
     * @param query
     * @param CustomerId
     * @return
     */
    private List<Object> createListOutOfQuery(Query query, int CustomerId){
    	List<Object> lstResult = null;
    	try{
    		@SuppressWarnings("unchecked")
			List<Object[]> lstItemsWithCount = query.getResultList();
    				
			CustomerEntity customer = (CustomerId > ApplicationConstants.DEFAULT_CUSTOMER_ID ?
											manager.find(CustomerEntity.class, CustomerId) :
											null);
			
			lstResult =  this.makeItemResultList(lstItemsWithCount, customer);
    	} catch(Exception e){
    		e.printStackTrace();
    	}
    	
    	return lstResult;
    }

    /**
     * 
     * @param searchParameters
     * @param OrderByColumn
     * @param Order
     * @return
     */
    private Query createQueryFromItemOnly(String searchParameters, 
    						  int PageNum, int ResultsAmount,
                              String OrderByColumn,
                              ApplicationConstants.OrderByOrder Order){
    	Query query = null;
        try{
        	query = this.createQuery(searchParameters, PageNum, ResultsAmount, "FROM Item i ",  OrderByColumn, Order);
        }catch(Exception e){
            e.printStackTrace();
        }

        return query;
    }

    /**
     * 
     * @param SearchParameters
     * @param FromClause
     * @param OrderByColumn
     * @param Order
     * @return
     */
    private Query createQuery(String SearchParameters,
			  				  int PageNum, int ResultsAmount,
                              String FromClause,
                              String OrderByColumn,
                              ApplicationConstants.OrderByOrder Order){
        Query query = null;
        try {
            String selectClause = "SELECT i.* ";

            String selectClauseCount = "SELECT COUNT(1) ";
            
            StringBuilder whereClause = new StringBuilder();
            StringBuilder fromClause = new StringBuilder(FromClause);

            String conditionName;
            String[] splitConditions = SearchParameters.split("&");

            if (!SearchParameters.isEmpty()){
                whereClause.insert(0, "WHERE ");

                for (int loop = 0; loop < splitConditions.length; loop++){
                    conditionName = splitConditions[loop].split("=")[0];
                    if (ApplicationConstants.conditions.containsKey(conditionName)) {
                    	
                        if (loop > 0){
                            whereClause.append("AND ");
                        }
                        
                    	whereClause.append(ApplicationConstants.conditions.get(conditionName)).append(" ");
                    	
                    	if (ApplicationConstants.extraTables.containsKey(conditionName)){
                    		fromClause.append(", ").append(ApplicationConstants.extraTables.get(conditionName)).append(" ");
                    	}
                    }
                }
            }

            StringBuilder orderByBuilder = new StringBuilder();
            String orderByClause = orderByBuilder
                    .insert(0,"ORDER BY ")
                    .append(OrderByColumn).append(" ")
                    .append(Order).append(" ").toString();

            
            int skipRecords = (PageNum - 1) * ResultsAmount;
            StringBuilder limitBuilder = new StringBuilder();
            String limitClause = limitBuilder
                    .insert(0,"LIMIT ")
                    .append(ResultsAmount)
                    .append(" OFFSET ")
                    .append(skipRecords).toString();

            StringBuilder wrappedPagination = new StringBuilder();
            StringBuilder wrappedPaginationCountSection = new StringBuilder();
            
            wrappedPaginationCountSection.insert(0, "(" + selectClauseCount)
            							 .append(fromClause.toString())
            							 .append(whereClause.toString())
            							 .append(") AS ROW_COUNT ");
            
            wrappedPagination.insert(0, selectClause)
            				 .append(", " + wrappedPaginationCountSection)
            				 .append(fromClause.toString())
            				 .append(whereClause.toString())
            				 .append(orderByClause)
            				 .append(limitClause);
                        
            query = manager.createNativeQuery(wrappedPagination.toString(), "Item.And.CountRows");
            
            if (!SearchParameters.isEmpty()){
                String[] splitParameters;
                String parameterName;
                String parameterValue;
                String parameterType;

                for (int i = 0; i < splitConditions.length; i++){
                    conditionName = splitConditions[i].split("=")[0];
                    if (ApplicationConstants.parameters.containsKey(conditionName)) {
	                    splitParameters = ApplicationConstants.parameters.get(conditionName).split(",");
	                    for (int j = 0; j < splitParameters.length; j++){
	                        parameterName = splitParameters[j].split(":")[0];
	                        parameterType = splitParameters[j].split(":")[1];
	                        
	                        int index = -1;
	                        boolean flag = true;
	                        for (int k = 0; k < splitConditions.length && flag; k++) {
	                        	if (splitConditions[k].startsWith(parameterName + "=")) {
	                        		index = k;
	                        		flag = false;
	                        	}
	                        }
	                        
	                        if (index > -1) {
		                        parameterValue = splitConditions[index].split("=")[1];
	                        } else {
	                        	parameterValue = splitConditions[i].split("=")[1];
	                        }
		
	                        if (parameterType.equals("java.lang.String")){
	                            query = query.setParameter(parameterName, parameterValue);
	                        } else if (parameterType.equals("java.lang.Integer")){
	                            query = query.setParameter(parameterName, Integer.parseInt(parameterValue));
	                        } else if (parameterType.equals("java.lang.Float")){
	                            query = query.setParameter(parameterName, Float.parseFloat(parameterValue));
	                        } else if (parameterType.equals("java.lang.Double")){
	                            query = query.setParameter(parameterName, Double.parseDouble(parameterValue));
	                        } else if (parameterType.equals("java.util.List")){
	                            String[] parameterOption = parameterValue.split(",");
	                            List<Integer> lstParameterOption = new ArrayList<Integer>();
	
	                            for (int k = 0; k < parameterOption.length; k++){
	                                lstParameterOption.add(Integer.parseInt(parameterOption[k]));
	                            }
	
	                            query = query.setParameter(parameterName, lstParameterOption);
	                        }
	                    }
                    }
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        
        return query;
    }

    /**
     *
     * @param lstItems
     * @return
     */
    private List<Object> makeItemResultList(List<Object[]> LstItems, CustomerEntity Customer){
    	List<Object> lstResult = null;

        if (LstItems != null) {
            try{
                Location location = null;

                List<ItemListSuperBean> lstNarrowItems = new ArrayList<ItemListSuperBean>();
                lstResult = new ArrayList<Object>();

                if (LstItems.size() > 0){
                    if (Customer != null){
                        location = new Location(Customer.getPoslatitude(), Customer.getPoslongitude());
                    }

                    ItemEntity item; 
                    
                    for (Object[] itemWithCount : LstItems){
                    	item = (ItemEntity) itemWithCount[0];
                    	
                        ItemPhotoEntity photo = getMainPhotoOfItem(item.getId());

                        String strPhoto = null;
                        if (photo != null) {
                            strPhoto = photo.getPhoto();
                        }

                        if (Customer != null &&
                                Customer.getId() == item.getThisCustomer().getId()){
                            lstNarrowItems.add(new ItemListSelfBean(item, strPhoto));
                        }
                        else{
                            lstNarrowItems.add(new ItemListPublicBean(location, item, strPhoto));
                        }
                    }
                    
                    BigInteger totalSize = (BigInteger)LstItems.get(0)[1];
                    lstResult.add(totalSize);
                }
                else{
                    lstResult.add(0);
                }
                
                lstResult.add(lstNarrowItems);
            }catch(Exception e){
                e.printStackTrace();
            }
        }

        return lstResult;
    }
}