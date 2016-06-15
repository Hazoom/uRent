package exportBeans.Public;

import application.Location;
import exportBeans.Abstract.ItemListSuperBean;
import entities.*;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 01/11/14
 * Time: 02:27
 * To change this template use File | Settings | File Templates.
 */
public class ItemListPublicBean extends ItemListSuperBean {

    public ItemListPublicBean(Location BaseLocation,
                              ItemEntity Item,
                              String Photo) {
        super(Item, Photo);

        if (BaseLocation != null){
            CustomerEntity owner = Item.getThisCustomer();

            this.ownerDistance = BaseLocation.calculateDistance(new Location(
                                        owner.getPoslatitude(), owner.getPoslongitude()));
        }
    }
}
