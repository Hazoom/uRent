package exportBeans;

/**
 * Created with IntelliJ IDEA.
 * User: Ran
 * Date: 16/01/15
 * Time: 17:49
 * To change this template use File | Settings | File Templates.
 */
public class RentNotificationsCountBean {

    private long buyerCount;
    private long supplierCount;

    public RentNotificationsCountBean(long buyerCount, long supplierCount) {
        this.buyerCount = buyerCount;
        this.supplierCount = supplierCount;
    }

    public long getBuyerCount() {
        return buyerCount;
    }

    public void setBuyerCount(long buyerCount) {
        this.buyerCount = buyerCount;
    }

    public long getSupplierCount() {
        return supplierCount;
    }

    public void setSupplierCount(long supplierCount) {
        this.supplierCount = supplierCount;
    }
}