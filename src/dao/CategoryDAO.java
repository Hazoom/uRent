package dao;

import exportBeans.CategoryBean;
import entities.CategoryEntity;

import javax.ejb.Local;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 30/11/14
 * Time: 13:22
 * To change this template use File | Settings | File Templates.
 */
@Local
public interface CategoryDAO {
    public List<CategoryBean> getAllCategories();
    public List<CategoryBean> getAllSonCategories(Integer parentCategory);
    public CategoryEntity getCategoryById(int CategoryId);
    public CategoryEntity getCategoryByName(String category);
}
