package exportBeans.Public;

import application.Location;
import exportBeans.Abstract.ItemDetailsSuperBean;
import exportBeans.FeedbackItemBean;
import exportBeans.RentScheduleBean;
import entities.*;

import java.text.DecimalFormat;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 01/11/14
 * Time: 02:27
 * To change this template use File | Settings | File Templates.
 */
public class ItemDetailsPublicBean extends ItemDetailsSuperBean {

    public ItemDetailsPublicBean(Location BaseLocation,
                                 ItemEntity Item,
                                 List<ItemPhotoEntity> Photos,
                                 List<FeedbackItemBean> Feedback,
                                 List<RentScheduleBean> Rents,
                                 CategoryEntity Category,
                                 CategoryEntity ParentCategory){
        super(Item, Photos, Feedback, Rents, Category, ParentCategory);

        CustomerEntity owner = Item.getThisCustomer();
        this.ownerId = owner.getId();
        this.ownerName = owner.getFirstname() + " " + owner.getLastname();
        this.ownerRate = owner.getRateassupplier();
        this.ownerRateCount = owner.getRateassuppliercount();
        this.ownerDistance = (BaseLocation != null ?
                              Double.parseDouble(new DecimalFormat("#.00").format(
                                      BaseLocation.calculateDistance(new Location(
                                              owner.getPoslatitude(), owner.getPoslongitude())))) :
                              -1);
    }
}
