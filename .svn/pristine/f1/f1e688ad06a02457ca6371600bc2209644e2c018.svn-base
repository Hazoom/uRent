package entities;

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
 * User: OWNER
 * Date: 31/10/14
 * Time: 13:14
 * To change this template use File | Settings | File Templates.
 */
@Table(name = "Customer", schema = "app")
@Entity
@NamedQueries({
        @NamedQuery(name="Customer.ID", query="SELECT c FROM CustomerEntity AS c ",
                hints={@QueryHint(name="org.hibernate.cacheable", value="true")})
})
@FilterDefs({
        @FilterDef(name="email", parameters={
                @ParamDef( name="eMail", type="java.lang.String" )
        })
})
@Filters( {
        @Filter(name="email", condition="EMAIL = :eMail")
} )
//@Cacheable
//@Cache(usage=CacheConcurrencyStrategy.NONSTRICT_READ_WRITE, region="customer")
public class CustomerEntity {
    private int id;

    @Column(name = "ID", nullable = false, length = 10)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    private Timestamp dateJoined;

    @Column(name = "DateJoined", nullable = false, length = 23, precision = 3)
    @Basic
    public Timestamp getDateJoined() {
        return dateJoined;
    }

    public void setDateJoined(Timestamp dateJoined) {
        this.dateJoined = dateJoined;
    }

    private String email;

    @Column(name = "EMAIL", nullable = false, unique = true, length = 50)
    @Basic
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    private String firstname;

    @Column(name = "FIRSTNAME", nullable = false, length = 50)
    @Basic
    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    private String lastname;

    @Column(name = "LASTNAME", nullable = false, length = 50)
    @Basic
    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    private double poslatitude;

    @Column(name = "POSLATITUDE", nullable = false, length = 53)
    @Basic
    public double getPoslatitude() {
        return poslatitude;
    }

    public void setPoslatitude(double poslatitude) {
        this.poslatitude = poslatitude;
    }

    private double poslongitude;

    @Column(name = "POSLONGITUDE", nullable = false, length = 53)
    @Basic
    public double getPoslongitude() {
        return poslongitude;
    }

    public void setPoslongitude(double poslongitude) {
        this.poslongitude = poslongitude;
    }

    private float rateassupplier;

    @Column(name = "RATEASSUPPLIER", nullable = false, length = 53)
    @Basic
    public float getRateassupplier() {
        return rateassupplier;
    }

    public void setRateassupplier(float rateassupplier) {
        this.rateassupplier = rateassupplier;
    }

    private int rateassuppliercount;

    @Column(name = "RATEASSUPPLIERCOUNT", nullable = false, length = 10)
    @Basic
    public int getRateassuppliercount() {
        return rateassuppliercount;
    }

    public void setRateassuppliercount(int rateassuppliercount) {
        this.rateassuppliercount = rateassuppliercount;
    }

    private float rateasbuyer;

    @Column(name = "RATEASBUYER", nullable = false, length = 53)
    @Basic
    public float getRateasbuyer() {
        return rateasbuyer;
    }

    public void setRateasbuyer(float rateasbuyer) {
        this.rateasbuyer = rateasbuyer;
    }

    private int rateasbuyercount;

    @Column(name = "RATEASBUYERCOUNT", nullable = false, length = 10)
    @Basic
    public int getRateasbuyercount() {
        return rateasbuyercount;
    }

    public void setRateasbuyercount(int rateasbuyercount) {
        this.rateasbuyercount = rateasbuyercount;
    }

    private String hashedpassword;

    @Column(name = "HASHEDPASSWORD", nullable = false, length = 2147483647)
    @Basic
    public String getHashedpassword() {
        return hashedpassword;
    }

    public void setHashedpassword(String hashedpassword) {
        this.hashedpassword = hashedpassword;
    }

    private String salt;

    @Column(name = "SALT", nullable = false, length = 2147483647)
    @Basic
    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    private boolean initpassword;

    @Column(name = "INITPASSWORD", nullable = false, length = 1)
    @Basic
    public boolean isInitpassword() {
        return initpassword;
    }

    public void setInitpassword(boolean initpassword) {
        this.initpassword = initpassword;
    }

    private int loginattempts;

    @Column(name = "LOGINATTEMPTS", nullable = false, length = 10)
    @Basic
    public int getLoginattempts() {
        return loginattempts;
    }

    public void setLoginattempts(int loginattempts) {
        this.loginattempts = loginattempts;
    }

    private Timestamp lastLogin;

    @Column(name = "LastLogin", nullable = true, length = 23, precision = 3)
    @Basic
    public Timestamp getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Timestamp lastLogin) {
        this.lastLogin = lastLogin;
    }

    private boolean suspended;

    @Column(name = "SUSPENDED", nullable = false, length = 1)
    @Basic
    public boolean isSuspended() {
        return suspended;
    }

    public void setSuspended(boolean suspended) {
        this.suspended = suspended;
    }

    private List<ItemEntity> items;

    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.REMOVE}, mappedBy = "thisCustomer")
    public List<ItemEntity> getItems() {
        return items;
    }

    public void setItems(List<ItemEntity> items) {
        this.items = items;
    }

    private List<RentEntity> buyerRents;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "thisBuyer")
    public List<RentEntity> getBuyerRents() {
        return buyerRents;
    }

    public void setBuyerRents(List<RentEntity> buyerRents) {
        this.buyerRents = buyerRents;
    }

    private List<RentEntity> supplierRents;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "thisSupplier")
    public List<RentEntity> getSupplierRents() {
        return supplierRents;
    }

    public void setSupplierRents(List<RentEntity> supplierRents) {
        this.supplierRents = supplierRents;
    }

    private List<UserMessageEntity> senderMessages;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "thisSender")
    public List<UserMessageEntity> getSenderMessages() {
        return senderMessages;
    }

    public void setSenderMessages(List<UserMessageEntity> senderMessages) {
        this.senderMessages = senderMessages;
    }

    private List<UserMessageEntity> receiverMessages;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "thisReceiver")
    public List<UserMessageEntity> getReceiverMessages() {
        return receiverMessages;
    }

    public void setReceiverMessages(List<UserMessageEntity> receiverMessages) {
        this.receiverMessages = receiverMessages;
    }

    public CustomerEntity() {
    }

    public CustomerEntity(String email, String firstname, String lastname,
                          double poslatitude, double poslongitude,
                          String hashedpassword, String salt) {
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.poslatitude = poslatitude;
        this.poslongitude = poslongitude;
        this.hashedpassword = hashedpassword;
        this.salt = salt;
    }

    @PrePersist
    private void setConstants(){
        this.dateJoined = new Timestamp(new Date().getTime());
        this.rateassupplier = Float.intBitsToFloat(0);
        this.rateassuppliercount = 0;
        this.rateasbuyer = Float.intBitsToFloat(0);
        this.rateasbuyercount = 0;
        this.initpassword = false;
        this.loginattempts = 0;
        this.lastLogin = null;
        this.suspended = false;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CustomerEntity that = (CustomerEntity) o;

        if (id != that.id) return false;
        if (initpassword != that.initpassword) return false;
        if (loginattempts != that.loginattempts) return false;
        if (Double.compare(that.poslatitude, poslatitude) != 0) return false;
        if (Double.compare(that.poslongitude, poslongitude) != 0) return false;
        if (rateasbuyercount != that.rateasbuyercount) return false;
        if (rateassuppliercount != that.rateassuppliercount) return false;
        if (suspended != that.suspended) return false;
        if (!email.equals(that.email)) return false;
        if (!firstname.equals(that.firstname)) return false;
        if (!hashedpassword.equals(that.hashedpassword)) return false;
        if (!lastname.equals(that.lastname)) return false;
        if (!salt.equals(that.salt)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result;
        long temp;
        result = id;
        result = 31 * result + email.hashCode();
        result = 31 * result + firstname.hashCode();
        result = 31 * result + lastname.hashCode();
        temp = poslatitude != +0.0d ? Double.doubleToLongBits(poslatitude) : 0L;
        result = 31 * result + (int) (temp ^ (temp >>> 32));
        temp = poslongitude != +0.0d ? Double.doubleToLongBits(poslongitude) : 0L;
        result = 31 * result + (int) (temp ^ (temp >>> 32));
        result = 31 * result + rateassuppliercount;
        result = 31 * result + rateasbuyercount;
        result = 31 * result + hashedpassword.hashCode();
        result = 31 * result + salt.hashCode();
        result = 31 * result + (initpassword ? 1 : 0);
        result = 31 * result + loginattempts;
        result = 31 * result + (suspended ? 1 : 0);
        return result;
    }

    @Override
    public String toString() {
        return "CustomerEntity{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                ", poslatitude=" + poslatitude +
                ", poslongitude=" + poslongitude +
                ", rateassupplier=" + rateassupplier +
                ", rateassuppliercount=" + rateassuppliercount +
                ", rateasbuyer=" + rateasbuyer +
                ", rateasbuyercount=" + rateasbuyercount +
                ", hashedpassword='" + hashedpassword + '\'' +
                ", salt='" + salt + '\'' +
                ", initpassword=" + initpassword +
                ", loginattempts=" + loginattempts +
                ", suspended=" + suspended +
                '}';
    }
}
