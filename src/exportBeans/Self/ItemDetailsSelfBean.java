package exportBeans.Self;

import exportBeans.Abstract.ItemDetailsSuperBean;
import exportBeans.FeedbackItemBean;
import exportBeans.RentScheduleBean;
import entities.*;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 01/11/14
 * Time: 02:27
 * To change this template use File | Settings | File Templates.
 */
public class ItemDetailsSelfBean extends ItemDetailsSuperBean {

    public ItemDetailsSelfBean(ItemEntity Item,
                               List<ItemPhotoEntity> Photos,
                               List<FeedbackItemBean> Feedback,
                               List<RentScheduleBean> Rents,
                               CategoryEntity Category,
                               CategoryEntity ParentCategory){
        super(Item, Photos, Feedback, Rents, Category, ParentCategory);
    }
}
