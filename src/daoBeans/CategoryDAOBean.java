package daoBeans;

import dao.CategoryDAO;
import exportBeans.CategoryBean;
import entities.CategoryEntity;
import org.hibernate.Session;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 27/10/14
 * Time: 22:16
 * To change this template use File | Settings | File Templates.
 */
@Stateless
public class CategoryDAOBean implements CategoryDAO {

    @PersistenceContext(unitName="WhyBuyPersistenceUnit")
    private EntityManager manager;

    public CategoryDAOBean() {}

    /**
     *
     * @return
     */
    @Override
    public List<CategoryBean> getAllCategories() {

        List<CategoryBean> lstBean = new ArrayList<CategoryBean>();

        try{
            List<CategoryEntity> lstEntity = manager
                    .createNamedQuery("Category.CategoryNameDesc", CategoryEntity.class)
                    .getResultList();

            List<CategoryEntity> subCategories = null;

            for (int i = 0; i < lstEntity.size(); i++) {
                if (lstEntity.get(i).getParentId() == null){
                    subCategories = new ArrayList<CategoryEntity>();

                    for (int j = 0; j < lstEntity.size(); j++){
                        if (lstEntity.get(j).getParentId() != null &&
                                lstEntity.get(i).getId() == lstEntity.get(j).getParentId()){
                            subCategories.add(lstEntity.get(j));
                        }
                    }

                    lstBean.add(this.convertEntity(lstEntity.get(i), subCategories));
                }
            }

        }catch (Exception e) {
            e.printStackTrace();
        }

        return lstBean;
    }

    /**
     *
     * @param parentCategory
     * @return
     */
    @Override
    public List<CategoryBean> getAllSonCategories(Integer parentCategory) {

        List<CategoryBean> lstBean = null;

        try{
            if (parentCategory != null){
                manager.unwrap(Session.class).enableFilter("parent").setParameter("parent", parentCategory);
                manager.unwrap(Session.class).disableFilter("categoryName");

                List<CategoryEntity> lstEntity = manager
                                     .createNamedQuery("Category.All", CategoryEntity.class)
                                     .getResultList();

                lstBean = new ArrayList<CategoryBean>();
                for (CategoryEntity c : lstEntity){
                    lstBean.add(this.convertEntity(c, null));
                }
            }

        }catch (Exception e) {
            e.printStackTrace();
        }

        return lstBean;
    }

    /**
     *
     * @param CategoryId
     * @return
     */
    @Override
    public CategoryEntity getCategoryById(int CategoryId) {
        CategoryEntity thisCategory = null;

        try{
            thisCategory = manager.find(CategoryEntity.class, CategoryId);
        }catch (Exception e) {
            e.printStackTrace();
        }

        return thisCategory;
    }

    /**
     *
     * @param category
     * @return
     */
    @Override
    public CategoryEntity getCategoryByName(String Category) {
        CategoryEntity category = null;

        try{
            manager.unwrap(Session.class).enableFilter("categoryName").setParameter("name", Category);

            category = manager
                    .createNamedQuery("Category.All", CategoryEntity.class)
                    .getSingleResult();

        }catch (Exception e) {
            e.printStackTrace();
        }

        return category;//this.convertEntity(category, null);
    }

    /**
     *
     * @param Category
     * @return
     */
    private CategoryBean convertEntity(CategoryEntity Category, List<CategoryEntity> SubCategories){
        CategoryBean category = null;

        try{
            category = new CategoryBean(Category, SubCategories);
        }catch(Exception e){
            e.printStackTrace();
        }

        return category;
    }
}