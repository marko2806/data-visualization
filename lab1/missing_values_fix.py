from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer
import pandas as pd

imputer = IterativeImputer()


e = pd.read_excel("data.xlsx", sheet_name="data", header=1, index_col=0)
print(e.index)
e_new = pd.DataFrame(imputer.fit_transform(e.to_numpy()), columns=list(e.columns))
e_new.index = e.index

e_new.to_excel("data_temp.xlsx", sheet_name="data")