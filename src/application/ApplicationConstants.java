package application;

import java.util.HashMap;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 12/10/14
 * Time: 18:22
 * To change this template use File | Settings | File Templates.
 */
public class ApplicationConstants {

    public static String PERSISTENCE_UNIT = "uRentPersistenceUnit";
    
    public static String HOST = "https://app-urent.rhcloud.com/";

    public static final int LOGIN_SUCCESSFUL = 0;
    public static final int CHANGE_PASSWORD = 1;
    public static final int USER_SUSPENDED = 2;
    public static final int LOGIN_FAILED = 3;

    public static final int MAX_LOGIN_ATTEMPTS = 3;

    public static final int ADD_CUSTOMER_SUCCEEDED = 0;
    public static final int USER_EXIST = 1;
    public static final int ADD_CUSTOMER_FAILED = 2;

    public static final int ADD_PRICE_FAILED = -1;

    public static final int ADD_ITEM_FAILED = -1;
    public static final int ADD_ITEM_EXISTS = -1;

    public static final String ADD_ITEM_PHOTO_FAILED = new String("-1");

    public static final int AREA_ALL_COUNTRY = 1;

    public static final String MAIL_USER = "tziktziktzik";
    public static final String MAIL_PASSWORD = "nf83k9wmd";

    public static final String MAIL_CONTENT_HEADER = 
    		"<a><img src=\"https://app-urent.rhcloud.com/img/uRent.jpg\"/></a><br>";

    public static final String MAIL_CONTENT_FOOTER = 
    		"<hr>"
    		+ "<b>uRent</b>";
    
    public static final String MAIL_CONTENT_FORGOT_PASSWORD = 
    		"<h3>We have been informed that you forgot your password.</h3> "
    		+ "<h3>Please follow this link: </h3>";
    public static final String MAIL_CONTENT_FORGOT_PASSWORD_LINK = "https://app-urent.rhcloud.com/#/InitPassword/";
    
    public static final String MAIL_CONTENT_NOTES = 
    		"<h1>Thank you for your time</h1>"
    		+ "<h3>Your notes have been received in our system "
    		+ "and our team will review them shortly.</h3>"
    		+ "<h3>You are taking part in making our community better!</h3>";

    public enum RentStatus {
        Requested,
        Approved,
        InRent,
        Ended,
        Closed,
        CancelledByBuyer,
        CancelledBySupplier
    }
    
    public enum RequestRentStatus {
    	Success,
    	CustomerFetchProblem,
    	NonMatchingDates,
    	ItemAlreadyRented,
    	SameCustomer,
    	InternalError
    }

    public static final int RENT_MIN_RATE = 1;
    public static final int RENT_MAX_RATE = 5;

    public static final int EARTH_MEAN_RADIUS_IN_KM = 6371;

    public enum OrderBy {
        BestMatch,
        Distance,
        DatePublished,
        RentCount,
        DailyPrice,
        WeeklyPrice,
        MonthlyPrice,
        Value,
        Rate
    }

    public enum OrderByOrder {
        Asc,
        Desc
    }

    public static HashMap<String, String> conditions = new HashMap<String, String>()
    {/**
		 * 
		 */
		private static final long serialVersionUID = 6505162647371655048L;

	{
            put("q", "levenshtein_String_Distance(ITEMNAME, :searchedExpressionWhere) >= 0.0");
            put("category", "CATEGORY IN (:categoriesId)");
            put("maxDistance", "haversine_Points_Distance(c.POSLATITUDE, c.POSLONGITUDE, :latitude, :longitude, :units) <= :maxDistance "
            		+ "AND c.id = i.customerId");
            put("minDaily", "DAILYPRICE >= :minPrice");
            put("maxDaily", "DAILYPRICE <= :maxPrice");
            put("minWeekly", "WEEKLYPRICE >= :minPrice");
            put("maxWeekly", "WEEKLYPRICE <= :maxPrice");
            put("minMonthly", "MONTHLYPRICE >= :minPrice");
            put("maxMonthly", "MONTHLYPRICE <= :maxPrice");
            put("minValue", "VALUE >= :minPrice");
            put("maxValue", "VALUE <= :maxPrice");
            put("minRentCount", "RENTCOUNT >= :rentCount");
            put("maxRentCount", "RENTCOUNT <= :rentCount");
            put("minRate", "RATE >= :rate");
            put("customer", "CUSTOMERID = :customerId");
            put("notCustomer", "CUSTOMERID != :customerId");
        }};

    public static HashMap<String, String> parameters = new HashMap<String, String>()
    {/**
		 * 
		 */
		private static final long serialVersionUID = 4493608073009868174L;

	{
            put("q", "searchedExpressionWhere:java.lang.String");
            put("category", "categoriesId:java.util.List");
            put("maxDistance", "latitude:java.lang.Double,longitude:java.lang.Double,maxDistance:java.lang.Double,units:java.lang.String");
            put("minDaily", "minPrice:java.lang.Float");
            put("maxDaily", "maxPrice:java.lang.Float");
            put("minWeekly", "minPrice:java.lang.Float");
            put("maxWeekly", "maxPrice:java.lang.Float");
            put("minMonthly", "minPrice:java.lang.Float");
            put("maxMonthly", "maxPrice:java.lang.Float");
            put("minValue", "minPrice:java.lang.Float");
            put("maxValue", "maxPrice:java.lang.Float");
            put("minRentCount", "rentCount:java.lang.Integer");
            put("maxRentCount", "rentCount:java.lang.Integer");
            put("minRate", "rate:java.lang.Float");
            put("customer", "customerId:java.lang.Integer");
            put("notCustomer", "customerId:java.lang.Integer");
        }};


        public static HashMap<String, String> extraTables = new HashMap<String, String>()
        {/**
			 * 
			 */
			private static final long serialVersionUID = -8910054478862064190L;

		{
                put("maxDistance", "Customer c");
            }};
    
    public static int DEFAULT_CUSTOMER_ID = -1;
    public static String DEFAULT_PARAMETERS = "";
    public static Boolean DEFAULT_MY_ITEMS_IND = false;
    public static String DEFAULT_ORDER_OPTION = "BestMatch";
    public static int DEFAULT_PAGE_NUM = 1;
    public static int DEFAULT_RESULT_PER_PAGE = 20;
    public static String DEFAULT_UNITS = "KM";
    public static ApplicationConstants.OrderByOrder DEFAULT_ORDER_BY_ORDER = ApplicationConstants.OrderByOrder.Desc;
}