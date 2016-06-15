package entities;

import application.ApplicationConstants;

import org.hibernate.annotations.*;
import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: Ran
 * Date: 31/10/14
 * Time: 01:38
 * To change this template use File | Settings | File Templates.
 */
@Table(name = "Rent", schema = "app")
@Entity
@NamedQueries({
    	@NamedQuery(name= "Rent.DateOpenedDesc",
            query="SELECT t FROM RentEntity AS t " +
                    "ORDER BY t.dateopened DESC"/*,
            hints={@QueryHint(name="org.hibernate.cacheable", value="true")}*/),
        @NamedQuery(name= "Rent.DateUpdatedDesc",
            query="SELECT t FROM RentEntity AS t " +
                    "ORDER BY t.dateupdated DESC"/*,
            hints={@QueryHint(name="org.hibernate.cacheable", value="true")}*/),
        @NamedQuery(name= "Rent.Count",
                query="SELECT COUNT(r) FROM RentEntity AS r ",
                hints={@QueryHint(name="org.hibernate.cacheable", value="true")})
})
@FilterDefs({
        @FilterDef(name="betweenDates", parameters={
                @ParamDef( name="startDate", type="java.util.Date"),
                @ParamDef( name="endDate", type="java.util.Date")
        }),
        @FilterDef(name="buyer", parameters={
                @ParamDef( name="buyerId", type="java.lang.Integer" )
        }),
        @FilterDef(name="supplier", parameters={
                @ParamDef( name="supplierId", type="java.lang.Integer" )
        }),
        @FilterDef(name="relatedCustomer", parameters={
                @ParamDef( name="buyer", type="java.lang.Integer" ),
                @ParamDef( name="supplier", type="java.lang.Integer" )
        }),
        @FilterDef(name="item", parameters={
                @ParamDef( name="itemId", type="java.lang.Integer" )
        }),
        @FilterDef(name="notBuyer", parameters={
                @ParamDef( name="buyer", type="java.lang.Integer" )
        }),
        @FilterDef(name="notificationsFromTimeForBuyer", parameters={
                @ParamDef( name="fromTime", type="java.sql.Timestamp" )
        }),
        @FilterDef(name="notificationsFromTimeForSupplier", parameters={
                @ParamDef( name="fromTime", type="java.sql.Timestamp" )
        }),
        @FilterDef(name="notificationsFromTime", parameters={
                @ParamDef( name="fromTime", type="java.sql.Timestamp" )
        }),
        @FilterDef(name="includedStatus", parameters={
                @ParamDef( name="statusId", type="java.lang.Integer" )
        }),
        @FilterDef(name="includedStatusList", parameters={
                @ParamDef( name="statusList", type="java.lang.Integer" )
        }),
        @FilterDef(name="excludedStatus", parameters={
                @ParamDef( name="statusId", type="java.lang.Integer" )
        }),
        @FilterDef(name="excludedStatusList", parameters={
                @ParamDef( name="statusList", type="java.lang.Integer" )
        })
})
@Filters({
        @Filter(name="betweenDates", condition="RENTTODATE >= :startDate AND RENTFROMDATE <= :endDate"),
        @Filter(name="buyer", condition="BUYERID = :buyerId"),
        @Filter(name="supplier", condition="SUPPLIERID = :supplierId"),
        @Filter(name="relatedCustomer", condition="(BUYERID = :buyer OR SUPPLIERID = :supplier)"),
        @Filter(name="item", condition="ITEMID = :itemId"),
        @Filter(name="notBuyer", condition="BuyerId != :buyer"),
        @Filter(name="notificationsFromTimeForBuyer", condition="LASTSUPPLIERACTION >= :fromTime"),
        @Filter(name="notificationsFromTimeForSupplier", condition="LASTBUYERACTION >= :fromTime"),
        @Filter(name="notificationsFromTime", condition="DATEUPDATED >= :fromTime"),
        @Filter(name="includedStatus", condition="STATUSID = :statusId"),
        @Filter(name="includedStatusList", condition="STATUSID in (:statusList)"),
        @Filter(name="excludedStatus", condition="STATUSID = :statusId"),
        @Filter(name="excludedStatusList", condition="STATUSID in (:statusList)")
})
@SqlResultSetMappings({
        @SqlResultSetMapping(name = "Feedback.Rent.Returned",
                entities = {
                        @EntityResult(entityClass = RentEntity.class),
                        @EntityResult(entityClass = FeedbackEntity.class)
                }
        ),
        @SqlResultSetMapping(name = "rows.And.CountRows",
                entities = {
                        @EntityResult(entityClass = RentEntity.class)
                },
                columns = {
                	@ColumnResult(name="ROW_COUNT")
                }
        )
})
//@Cacheable
//@Cache(usage=CacheConcurrencyStrategy.NONSTRICT_READ_WRITE, region="rent")
public class RentEntity {
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

    private Timestamp dateopened;

    @Column(name = "DateOpened", nullable = false, length = 23, precision = 3)
    @Basic
    public Timestamp getDateopened() {
        return dateopened;
    }

    public void setDateopened(Timestamp dateopened) {
        this.dateopened = dateopened;
    }

    private Timestamp dateupdated;

    @Column(name = "DateUpdated", nullable = false, length = 23, precision = 3)
    @Basic
    public Timestamp getDateupdated() {
        return dateupdated;
    }

    public void setDateupdated(Timestamp dateupdated) {
        this.dateupdated = dateupdated;
    }

    private Date rentfromdate;

    @Column(name = "RentFromDate", nullable = false, length = 23, precision = 3)
    @Basic
    @Temporal(TemporalType.DATE)
    public Date getRentfromdate() {
        return rentfromdate;
    }

    public void setRentfromdate(Date rentfromdate) {
        this.rentfromdate = rentfromdate;
    }

    private Date renttodate;

    @Column(name = "RentToDate", nullable = false, length = 23, precision = 3)
    @Basic
    @Temporal(TemporalType.DATE)
    public Date getRenttodate() {
        return renttodate;
    }

    public void setRenttodate(Date renttodate) {
        this.renttodate = renttodate;
    }

    private CustomerEntity thisBuyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BuyerId", nullable = false, insertable = true, updatable = true)
    public CustomerEntity getThisBuyer() {
        return thisBuyer;
    }

    public void setThisBuyer(CustomerEntity thisBuyer) {
        this.thisBuyer = thisBuyer;
    }

    private CustomerEntity thisSupplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SupplierId", nullable = false, insertable = true, updatable = true)
    public CustomerEntity getThisSupplier() {
        return thisSupplier;
    }

    public void setThisSupplier(CustomerEntity thisSupplier) {
        this.thisSupplier = thisSupplier;
    }

    private ItemEntity thisItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ItemId", nullable = false, insertable = true, updatable = true)
    public ItemEntity getThisItem() {
        return thisItem;
    }

    public void setThisItem(ItemEntity thisItem) {
        this.thisItem = thisItem;
    }

    private ApplicationConstants.RentStatus thisStatus;

    @Column(name = "StatusId", nullable = false, length = 10)
    @Basic
    @Enumerated(EnumType.ORDINAL)
    public ApplicationConstants.RentStatus getThisStatus() {
        return thisStatus;
    }

    public void setThisStatus(ApplicationConstants.RentStatus thisStatus) {
        this.thisStatus = thisStatus;
    }

    private String itemDescriptionPreRent;

    @Column(name = "ItemDescriptionPreRent", nullable = false, length = 2147483647)
    @Basic
    public String getItemDescriptionPreRent() {
        return itemDescriptionPreRent;
    }

    public void setItemDescriptionPreRent(String itemDescriptionPreRent) {
        this.itemDescriptionPreRent = itemDescriptionPreRent;
    }

    private FeedbackEntity thisFeedback;

    @OneToOne (cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    @JoinColumn(name = "FeedbackId", nullable = false)
//    @PrimaryKeyJoinColumn
    public FeedbackEntity getThisFeedback() {
        return thisFeedback;
    }

    public void setThisFeedback(FeedbackEntity thisFeedback) {
        this.thisFeedback = thisFeedback;
    }

    private String cancellationReason;

    @Column(name = "CancellationReason",  length = 2147483647)
    @Basic
    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    private Timestamp lastBuyerAction;

    @Column(name = "LastBuyerAction", nullable = true, length = 23, precision = 3)
    @Basic
    public Timestamp getLastBuyerAction() {
        return lastBuyerAction;
    }

    public void setLastBuyerAction(Timestamp lastBuyerAction) {
        this.lastBuyerAction = lastBuyerAction;
    }

    private Timestamp lastSupplierAction;

    @Column(name = "LastSupplierAction", nullable = true, length = 23, precision = 3)
    @Basic
    public Timestamp getLastSupplierAction() {
        return lastSupplierAction;
    }

    public void setLastSupplierAction(Timestamp lastSupplierAction) {
        this.lastSupplierAction = lastSupplierAction;
    }
    
    private boolean isNewBuyer;

    @Column(name = "IsNewBuyer", nullable = false, length = 1)
    @Basic
    public boolean getIsNewBuyer() {
        return isNewBuyer;
    }

    public void setIsNewBuyer(boolean isNewBuyer) {
        this.isNewBuyer = isNewBuyer;
    }
    
    private boolean isNewSupplier;

    @Column(name = "IsNewSupplier", nullable = false, length = 1)
    @Basic
    public boolean getIsNewSupplier() {
        return isNewSupplier;
    }

    public void setIsNewSupplier(boolean isNewSupplier) {
        this.isNewSupplier = isNewSupplier;
    }

    private List<UserMessageEntity> rentMessages;

    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.REMOVE}, mappedBy = "thisRent")
    public List<UserMessageEntity> getRentMessages() {
        return rentMessages;
    }

    public void setRentMessages(List<UserMessageEntity> rentMessages) {
        this.rentMessages = rentMessages;
    }

    public RentEntity() {
    }

    public RentEntity(Date rentfromdate,
                      Date renttodate,
                      CustomerEntity thisBuyer,
                      CustomerEntity thisSupplier,
                      ItemEntity thisItem,
                      FeedbackEntity thisFeedback) {
        this.rentfromdate = rentfromdate;
        this.renttodate = renttodate;
        this.thisBuyer = thisBuyer;
        this.thisSupplier = thisSupplier;
        this.thisItem = thisItem;
        this.thisFeedback = thisFeedback;
    }

    @PrePersist
    private void setConstants(){
        this.dateopened = new Timestamp(new Date().getTime());
        this.dateupdated = new Timestamp(new Date().getTime());
        this.thisStatus = ApplicationConstants.RentStatus.Requested;
        this.itemDescriptionPreRent = "";
        this.lastBuyerAction = new Timestamp(new Date().getTime());
        this.lastSupplierAction = null;
        this.isNewBuyer = true;
        this.isNewSupplier = true;
    }

    @PreUpdate
    private void setLastUpdated(){
        this.dateupdated = new Timestamp(new Date().getTime());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RentEntity that = (RentEntity) o;

        if (id != that.id) return false;
        if (dateopened != null ? !dateopened.equals(that.dateopened) : that.dateopened != null) return false;
        if (dateupdated != null ? !dateupdated.equals(that.dateupdated) : that.dateupdated != null) return false;
        if (rentfromdate != null ? !rentfromdate.equals(that.rentfromdate) : that.rentfromdate != null) return false;
        if (renttodate != null ? !renttodate.equals(that.renttodate) : that.renttodate != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (dateopened != null ? dateopened.hashCode() : 0);
        result = 31 * result + (dateupdated != null ? dateupdated.hashCode() : 0);
        result = 31 * result + (rentfromdate != null ? rentfromdate.hashCode() : 0);
        result = 31 * result + (renttodate != null ? renttodate.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "RentEntity{" +
                "id=" + id +
                ", dateopened=" + dateopened +
                ", dateupdated=" + dateupdated +
                ", rentfromdate=" + rentfromdate +
                ", renttodate=" + renttodate +
                '}';
    }
}
