package exportBeans;

import entities.CustomerEntity;
import entities.FeedbackEntity;
import entities.RentEntity;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 01/11/14
 * Time: 02:27
 * To change this template use File | Settings | File Templates.
 */
public class FeedbackBuyerBean {

    private int id;
    
    private long feedbackTime;

    private int raterId;
    private String raterName;

    private Integer rate;
    private String feedback;

    public FeedbackBuyerBean(RentEntity rent, FeedbackEntity feedback) {
        this.id = feedback.getId();
        
        this.feedbackTime = rent.getLastSupplierAction().getTime();

        CustomerEntity customer = rent.getThisSupplier();
        this.raterId = customer.getId();
        this.raterName = customer.getFirstname() + " " + customer.getLastname();

        this.rate = feedback.getBuyerRate();
        this.feedback = feedback.getBuyerFeedback();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public long getFeedbackTime() {
		return feedbackTime;
	}

	public void setFeedbackTime(long feedbackTime) {
		this.feedbackTime = feedbackTime;
	}

    public int getRaterId() {
        return raterId;
    }

    public void setRaterId(int raterId) {
        this.raterId = raterId;
    }

    public String getRaterName() {
        return raterName;
    }

    public void setRaterName(String raterName) {
        this.raterName = raterName;
    }

    public Integer getRate() {
        return rate;
    }

    public void setRate(Integer rate) {
        this.rate = rate;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}
