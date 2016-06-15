package exportBeans.Self;

import application.ApplicationConstants;
import exportBeans.Abstract.RentDetailsSuperBean;
import entities.*;

/**
 * Created with IntelliJ IDEA.
 * User: Ran
 * Date: 16/01/15
 * Time: 15:41
 * To change this template use File | Settings | File Templates.
 */
public class RentDetailsSelfBean extends RentDetailsSuperBean {

    public RentDetailsSelfBean(RentEntity Rent, int ownerId) {
        super(Rent);

        this.dateOpened = Rent.getDateopened().getTime();
        this.dateUpdated = Rent.getDateupdated().getTime();

        CustomerEntity other;
        int otherId = Rent.getThisBuyer().getId();
        if (ownerId == otherId){
            other = Rent.getThisSupplier();
            this.isBuyer = true;
        }
        else{
            other = Rent.getThisBuyer();
            this.isBuyer = false;
        }
        this.otherId = other.getId();
        this.otherName = other.getFirstname() + " " + other.getLastname();

        ApplicationConstants.RentStatus status = Rent.getThisStatus();
        this.statusId = status.ordinal();
        this.statusDescription = status.name();
        
        //this.cancellationReason = Rent.getCancellationReason();
    }
}
