package exportBeans.Self;

import application.ApplicationConstants;
import exportBeans.Abstract.RentListSuperBean;
import entities.*;

/**
 * Created with IntelliJ IDEA.
 * User: Ran
 * Date: 16/01/15
 * Time: 15:41
 * To change this template use File | Settings | File Templates.
 */
public class RentListSelfBean extends RentListSuperBean {

    public RentListSelfBean(RentEntity Rent, int OwnerId) {
        super(Rent);

        ApplicationConstants.RentStatus status = Rent.getThisStatus();
        this.statusId = status.ordinal();
        switch (this.statusId){
            case (5):
                this.statusDescription = "Cancelled By Buyer";
                break;
            case (6):
                this.statusDescription = "Cancelled By Supplier";
                break;
            default:
                this.statusDescription = status.name();
                break;
        }

        CustomerEntity other;
        int otherId = Rent.getThisBuyer().getId();
        if (OwnerId == otherId){ // OwnerId is the Buyer
            other = Rent.getThisSupplier();
            
            this.isNew = Rent.getIsNewBuyer();
            
//            this.isNew = (Rent.getLastSupplierAction() != null &&
//            					Rent.getLastSupplierAction().getTime() > Rent.getThisBuyer().getLastLogin().getTime());
        }
        else { // OwnerId is the Supplier
            other = Rent.getThisBuyer();

            this.isNew = Rent.getIsNewSupplier();
            
//            this.isNew = (Rent.getLastBuyerAction() != null &&
//            					Rent.getLastBuyerAction().getTime() > Rent.getThisSupplier().getLastLogin().getTime());
        }
        this.otherId = other.getId();
        this.otherName = other.getFirstname() + " " + other.getLastname();
    }
}
