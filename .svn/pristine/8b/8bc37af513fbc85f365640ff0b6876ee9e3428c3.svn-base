package entities;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

/**
 * Created with IntelliJ IDEA.
 * User: Ran
 * Date: 31/10/14
 * Time: 01:38
 * To change this template use File | Settings | File Templates.
 */
@Table(name = "Feedback", schema = "app")
@Entity
@NamedQueries({
        @NamedQuery(name= "Feedback.IdDesc",
                query="SELECT f FROM FeedbackEntity AS f " +
                        "ORDER BY f.id DESC",
                hints={@QueryHint(name="org.hibernate.cacheable", value="true")}),
        @NamedQuery(name= "Feedback.Rent.DateOpenedDESC",
                query="SELECT f, r FROM RentEntity r JOIN r.thisFeedback f " +
                       "ORDER BY r.dateopened DESC",
                hints={@QueryHint(name="org.hibernate.cacheable", value="true")}),
        @NamedQuery(name= "Feedback.OpenedForBuyerRate",
                query="SELECT r FROM RentEntity AS r " +
                        "WHERE r.thisFeedback.buyerRate is NULL ",
                hints={@QueryHint(name="org.hibernate.cacheable", value="true")}),
        @NamedQuery(name= "Feedback.OpenedForSupplierOrItemRate",
                query="SELECT r FROM RentEntity AS r " +
                        "WHERE r.thisFeedback.supplierRate is NULL OR r.thisFeedback.itemRate is NULL ",
                hints={@QueryHint(name="org.hibernate.cacheable", value="true")})
})
//@FilterDefs({
//        @FilterDef(name="feedbackId", parameters={
//                @ParamDef( name="feedbackId", type="java.lang.Integer" )
//        }),
//})
//@Filters({
//        @Filter(name="feedbackId", condition="feedbackId = :feedbackId"),
//})
//@Cacheable
//@Cache(usage=CacheConcurrencyStrategy.NONSTRICT_READ_WRITE, region="rent")
public class FeedbackEntity {
    private int id;

    @Column(name = "Id", nullable = false, length = 10)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    private Integer buyerRate;

    @Column(name = "BuyerRate", nullable = true, length = 10)
    @Basic
    public Integer getBuyerRate() {
        return buyerRate;
    }

    public void setBuyerRate(Integer buyerRate) {
        this.buyerRate = buyerRate;
    }

    private String buyerFeedback;

    @Column(name = "BuyerFeedback", nullable = true, length = 2147483647)
    @Basic
    public String getBuyerFeedback() {
        return buyerFeedback;
    }

    public void setBuyerFeedback(String buyerFeedback) {
        this.buyerFeedback = buyerFeedback;
    }

    private Integer supplierRate;

    @Column(name = "SupplierRate", nullable = true, length = 10)
    @Basic
    public Integer getSupplierRate() {
        return supplierRate;
    }

    public void setSupplierRate(Integer supplierRate) {
        this.supplierRate = supplierRate;
    }

    private String supplierFeedback;

    @Column(name = "SupplierFeedback", nullable = true, length = 2147483647)
    @Basic
    public String getSupplierFeedback() {
        return supplierFeedback;
    }

    public void setSupplierFeedback(String supplierFeedback) {
        this.supplierFeedback = supplierFeedback;
    }

    private Integer itemRate;

    @Column(name = "ItemRate", nullable = true, length = 10)
    @Basic
    public Integer getItemRate() {
        return itemRate;
    }

    public void setItemRate(Integer itemRate) {
        this.itemRate = itemRate;
    }

    private String itemFeedback;

    @Column(name = "ItemFeedback", nullable = true, length = 2147483647)
    @Basic
    public String getItemFeedback() {
        return itemFeedback;
    }

    public void setItemFeedback(String itemFeedback) {
        this.itemFeedback = itemFeedback;
    }

    public FeedbackEntity() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FeedbackEntity)) return false;

        FeedbackEntity that = (FeedbackEntity) o;

        if (id != that.id) return false;
        if (!buyerFeedback.equals(that.buyerFeedback)) return false;
        if (!buyerRate.equals(that.buyerRate)) return false;
        if (!itemFeedback.equals(that.itemFeedback)) return false;
        if (!itemRate.equals(that.itemRate)) return false;
        if (!supplierFeedback.equals(that.supplierFeedback)) return false;
        if (!supplierRate.equals(that.supplierRate)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + buyerRate.hashCode();
        result = 31 * result + buyerFeedback.hashCode();
        result = 31 * result + supplierRate.hashCode();
        result = 31 * result + supplierFeedback.hashCode();
        result = 31 * result + itemRate.hashCode();
        result = 31 * result + itemFeedback.hashCode();
        return result;
    }

    @Override
    public String toString() {
        return "FeedbackEntity{" +
                "id=" + id +
                ", buyerRate=" + buyerRate +
                ", buyerFeedback='" + buyerFeedback + '\'' +
                ", supplierRate=" + supplierRate +
                ", supplierFeedback='" + supplierFeedback + '\'' +
                ", itemRate=" + itemRate +
                ", itemFeedback='" + itemFeedback + '\'' +
                '}';
    }
}
