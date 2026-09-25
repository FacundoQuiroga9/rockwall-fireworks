import { useContext } from 'react';
import { MyListContext } from './myListContext';
export const useMyList = () => useContext(MyListContext);
