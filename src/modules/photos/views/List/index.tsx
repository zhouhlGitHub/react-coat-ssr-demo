import {toPath, toUrl} from "common/routers";
import Icon, {IconClass} from "components/Icon";
import LinkButton from "components/LinkButton";
import Pagination from "components/Pagination";
import Search from "components/Search";
import {routerActions} from "connected-react-router";
import {ListItem, ListSearch, ListSummary} from "entity/photo";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  showSearch: boolean;
  pathname: string;
  listSearch: ListSearch | undefined;
  listItems: ListItem[] | undefined;
  listSummary: ListSummary | undefined;
}

let scrollTop = 0;

class Component extends React.PureComponent<Props> {
  private onSearch = (title: string) => {
    const {dispatch, pathname} = this.props;
    dispatch(routerActions.push(toUrl(pathname, {photos: {search: {title}}})));
  };
  private onSearchClose = () => {
    const {dispatch, pathname} = this.props;
    dispatch(routerActions.push(toUrl(pathname, {app: {showSearch: false}, photos: {search: {title: ""}}})));
  };

  public render() {
    const {dispatch, showSearch, pathname, listSearch, listItems, listSummary} = this.props;

    if (listItems && listSearch) {
      const itemBaseUrl = toUrl(toPath(ModuleNames.comments, "Main", {type: "photos", typeId: "---"}), {
        comments: {search: {articleId: "---"}},
      });
      return (
        <div className={`${ModuleNames.photos}-List g-pic-list`}>
          <Search value={listSearch.title} onClose={this.onSearchClose} onSearch={this.onSearch} visible={showSearch || !!listSearch.title} />
          <div className="list-items">
            {listItems.map(item => (
              <LinkButton onClick={this.onItemClick} dispatch={dispatch} href={itemBaseUrl.replace(/---/g, item.id)} key={item.id} className="g-pre-img">
                <div style={{backgroundImage: `url(${item.coverUrl})`}}>
                  <h5 className="title">{item.title}</h5>
                  <div className="listImg" />
                  <div className="props">
                    <Icon type={IconClass.LOCATION} /> {item.departure}
                    <Icon type={IconClass.HEART} /> {item.type}
                  </div>
                  <div className="desc">
                    <span className="hot">
                      人气(<strong>{item.hot}</strong>)
                    </span>
                    <em className="price">
                      <span className="unit">￥</span>
                      {item.price}
                    </em>
                  </div>
                </div>
              </LinkButton>
            ))}
          </div>
          {listSummary && (
            <div className="g-pagination">
              <Pagination dispatch={dispatch} baseUrl={toUrl(pathname, {photos: {search: {...listSearch, page: NaN}}})} page={listSummary.page} totalPages={listSummary.totalPages} />
            </div>
          )}
        </div>
      );
    } else {
      return null;
    }
  }
  private scroll = () => {
    window.scrollTo(0, scrollTop);
    scrollTop = 0;
  };
  private onItemClick = () => {
    scrollTop = window.pageYOffset;
  };
  public componentDidMount() {
    this.scroll();
  }
  public componentDidUpdate() {
    this.scroll();
  }
}

const mapStateToProps = (state: RootState) => {
  const model = state.photos!;
  return {
    showSearch: Boolean(state.app!.showSearch),
    pathname: state.router.location.pathname,
    listSearch: model.listSearch,
    listItems: model.listItems,
    listSummary: model.listSummary,
  };
};

export default connect(mapStateToProps)(Component);
