import * as React from 'react';
import { SectionListProps, ViewStyle, RegisteredStyle, SectionListData } from 'react-native';
interface IProps extends SectionListProps<any> {
    scrollToLocationOffset?: number;
    tabBarStyle?: ViewStyle | RegisteredStyle<ViewStyle>;
    renderTab: (section: SectionListData<any>) => React.ReactNode;
 
}
interface IState {
    currentIndex: number;
}
export default class SectionList extends React.PureComponent<IProps, IState> {
    state: IState;
    private blockUpdateIndex;
    private sectionList;
    render(): JSX.Element;
    onPress: (index: number) => void;
}
export {};
