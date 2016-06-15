package exportBeans.Self;

import exportBeans.Abstract.ItemListSuperBean;
import entities.ItemEntity;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 01/11/14
 * Time: 02:27
 * To change this template use File | Settings | File Templates.
 */
public class ItemListSelfBean extends ItemListSuperBean {

    public ItemListSelfBean(ItemEntity Item,
                            String Photo) {
        super(Item, Photo);
    }
}