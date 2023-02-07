import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer

data = pd.read_csv("./lab2/data_filled.csv")

data = data.melt("Country")

data.to_csv("./lab2/data_melted.csv", index=False)